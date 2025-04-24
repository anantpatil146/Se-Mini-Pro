# LLM Configuration
LLM_MODEL = "llama3.2"
RETRIEVER_K = 3
MAX_SOURCE_DOCUMENTS = 2

# Prompt Templates
QA_PROMPT = """
Use the following context to answer the question. 
If you don't know the answer, just say "I don't know" - don't make up an answer.
Keep your response concise (3-4 sentences).

Context: {context}
Question: {question}

Helpful Answer:"""