from flask import Flask, request, jsonify, render_template, session
import os
from werkzeug.utils import secure_filename
from transformers import pipeline
import fitz  # PyMuPDF
import uuid

app = Flask(__name__)
app.secret_key = 'your-secret-key'  # Replace with a proper secret key in production

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize NLP pipelines
summarizer = pipeline("summarization")
qa_pipeline = pipeline("question-answering")

# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Extract text from PDF
def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if the post request has the file part
    if 'resume' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['resume']
    
    # If user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        # Secure the filename and generate a unique name
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        
        # Save the file
        file.save(file_path)
        
        # Extract text from PDF
        resume_text = extract_text_from_pdf(file_path)
        
        # Store in session
        session['resume_text'] = resume_text
        session['resume_path'] = file_path
        
        return jsonify({
            'success': True,
            'filename': filename
        })
    
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/analyze', methods=['POST'])
def analyze_resume():
    try:
        data = request.json
        question = data.get('question', '')

        if not question:
            return jsonify({'error': 'Question is required'}), 400

        if 'resume_text' not in session:
            return jsonify({'error': 'Please upload a resume first'}), 400

        resume_text = session['resume_text']
        
        # Truncate text if needed (model context limitations)
        max_length = 512
        if len(resume_text) > max_length:
            resume_text = resume_text[:max_length]
        
        # Use question-answering pipeline
        result = qa_pipeline(
            question=question,
            context=resume_text
        )
        
        answer = result['answer']
        
        return jsonify({
            'success': True,
            'answer': answer,
            'sources': ['Resume']  # Simplified source tracking
        })
    except Exception as e:
        return jsonify({'error': f'Error analyzing resume: {str(e)}'}), 500

@app.route('/job-match', methods=['POST'])
def job_match():
    try:
        data = request.json
        job_description = data.get('jobDescription', '')

        if not job_description:
            return jsonify({'error': 'Job description is required'}), 400

        if 'resume_text' not in session:
            return jsonify({'error': 'Please upload a resume first'}), 400

        resume_text = session['resume_text']
        
        # Simplified job matching logic
        # In a real app, you'd want more sophisticated matching
        
        # Generate a summary of the resume
        resume_summary = summarizer(
            resume_text, 
            max_length=100, 
            min_length=30, 
            do_sample=False
        )[0]['summary_text']
        
        # Generate a summary of the job description
        job_summary = summarizer(
            job_description, 
            max_length=100, 
            min_length=30, 
            do_sample=False
        )[0]['summary_text']
        
        # Use QA pipeline to analyze the match
        match_prompt = f"How well does this resume match the job description? Resume: {resume_summary}. Job: {job_summary}"
        match_analysis = qa_pipeline(
            question=match_prompt,
            context=resume_text + " " + job_description
        )['answer']
        
        # Simple scoring mechanism (would be more sophisticated in a real app)
        common_words = set(resume_text.lower().split()) & set(job_description.lower().split())
        match_score = min(100, len(common_words) * 2)
        
        return jsonify({
            'success': True,
            'match_analysis': match_analysis,
            'match_score': match_score
        })
    except Exception as e:
        return jsonify({'error': f'Error matching job: {str(e)}'}), 500

@app.route('/clear', methods=['POST'])
def clear_session():
    # Clear the session
    session.pop('resume_text', None)
    session.pop('resume_path', None)
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Run on a different port than the main app