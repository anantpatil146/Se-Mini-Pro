from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.llms import HuggingFaceHub
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize the language model
def get_llm():
    """Initialize and return the language model"""
    # Use Hugging Face Hub for the language model
    repo_id = "google/flan-t5-large"  # You can change this to a different model
    llm = HuggingFaceHub(
        repo_id=repo_id,
        model_kwargs={"temperature": 0.5, "max_length": 512}
    )
    return llm

# Initialize embeddings
def get_embeddings():
    """Initialize and return the embeddings model"""
    model_name = "sentence-transformers/all-mpnet-base-v2"
    embeddings = HuggingFaceEmbeddings(model_name=model_name)
    return embeddings

def create_qa_chain(pdf_path):
    """Create a QA chain for a PDF file"""
    # Load the PDF
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    
    # Split the documents into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = text_splitter.split_documents(documents)
    
    # Create the vector store
    embeddings = get_embeddings()
    vectorstore = FAISS.from_documents(chunks, embeddings)
    
    # Create the QA chain
    llm = get_llm()
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever(),
        return_source_documents=True
    )
    
    return qa_chain

def ask_question(qa_chain, question, return_text=False):
    """Ask a question using the QA chain"""
    result = qa_chain({"query": question})
    
    # Extract the answer and sources
    answer = result.get("result", "")
    source_documents = result.get("source_documents", [])
    
    # Extract source information
    sources = []
    for doc in source_documents:
        source = f"Page {doc.metadata.get('page', 'unknown')}"
        if source not in sources:
            sources.append(source)
    
    if return_text:
        return {
            "answer": answer,
            "sources": sources
        }
    
    return result

def match_job(qa_chain, job_description):
    """Match a job description with the resume"""
    # Extract skills from the job description
    job_skills_query = "What skills are required in this job description: " + job_description
    job_skills_result = ask_question(qa_chain, job_skills_query)
    job_skills = job_skills_result.get("result", "")
    
    # Extract skills from the resume
    resume_skills_query = "What skills does the candidate have based on their resume?"
    resume_skills_result = ask_question(qa_chain, resume_skills_query)
    resume_skills = resume_skills_result.get("result", "")
    
    # Compare the skills
    comparison_query = f"""
    Compare these job requirements: {job_skills}
    With these candidate skills: {resume_skills}
    
    Provide a detailed analysis of how well the candidate matches the job requirements.
    Include:
    1. Overall match percentage
    2. Matching skills
    3. Missing skills
    4. Suggestions for improvement
    """
    
    comparison_result = ask_question(qa_chain, comparison_query)
    match_analysis = comparison_result.get("result", "")
    
    # Extract match score (simple implementation - in a real app, you'd want more sophisticated scoring)
    match_score = 0
    try:
        # Try to extract a percentage from the match analysis
        import re
        match = re.search(r'(\d+)%', match_analysis)
        if match:
            match_score = int(match.group(1))
        else:
            # Fallback to a simple keyword-based score
            match_score = min(100, len(set(resume_skills.lower().split()) & set(job_skills.lower().split())) * 5)
    except:
        # If all else fails, provide a default score
        match_score = 50
    
    return {
        "match_analysis": match_analysis,
        "match_score": match_score
    }