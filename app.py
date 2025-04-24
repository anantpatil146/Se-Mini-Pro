import os
import tempfile
from flask import Flask, render_template, request, jsonify, session
from flask_session import Session
from werkzeug.utils import secure_filename
import rag_module as rag
from flask_cors import CORS

# === Flask Setup ===
app = Flask(__name__)
app.secret_key = 'ai_recruitment_platform_secret_key'

# === Upload Directory Setup ===
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# === Session and CORS Config ===
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True,
        "expose_headers": ["Set-Cookie"]
    }
}, supports_credentials=True)

app.config.update(
    SESSION_TYPE='filesystem',
    SESSION_COOKIE_SAMESITE='None',
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    MAX_CONTENT_LENGTH=16 * 1024 * 1024,
    PERMANENT_SESSION_LIFETIME=1800
)
Session(app)

# === Initialize Session Defaults ===
@app.before_request
def initialize_session():
    if 'pdf_path' not in session:
        session['pdf_path'] = None
    if 'qa_initialized' not in session:
        session['qa_initialized'] = False

# === QA Chain Management ===
qa_chains = {}

def get_qa_chain(pdf_path):
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF not found at: {pdf_path}")
    if pdf_path not in qa_chains:
        vector = rag.load_or_create_embeddings(pdf_path)
        qa_chains[pdf_path] = rag.setup_qa_chain(vector)
    return qa_chains[pdf_path]

# === Routes ===
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'resume' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['resume']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are allowed'}), 400

        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        session['pdf_path'] = file_path
        session['qa_initialized'] = True

        return jsonify({
            'success': True,
            'message': 'Resume uploaded successfully',
            'filename': filename,
            'file_path': file_path
        })
    except Exception as e:
        return jsonify({'error': f'Upload error: {str(e)}'}), 500

@app.route('/analyze', methods=['POST'])
def analyze_resume():
    try:
        data = request.json
        question = data.get('question', '')
        use_latest_resume = data.get('useLatestResume', False)

        if not question:
            return jsonify({'error': 'Question is required'}), 400

        upload_dir = app.config['UPLOAD_FOLDER']

        if use_latest_resume or not session.get('pdf_path'):
            pdf_files = [f for f in os.listdir(upload_dir)
                         if f.endswith('.pdf') and os.path.isfile(os.path.join(upload_dir, f))]
            if not pdf_files:
                return jsonify({'error': 'No resume found in uploads folder'}), 400

            selected_pdf = max(pdf_files, key=lambda x: os.path.getmtime(os.path.join(upload_dir, x)))
            session['pdf_path'] = os.path.join(upload_dir, selected_pdf)
            session['qa_initialized'] = True

        pdf_path = session.get('pdf_path')
        if not pdf_path:
            return jsonify({'error': 'No resume selected. Please upload or choose a resume first.'}), 400

        qa_chain = get_qa_chain(pdf_path)
        result = rag.ask_question(qa_chain, question, return_text=True)

        return jsonify({
            'success': True,
            'answer': result.get('answer', ''),
            'sources': result.get('sources', [])
        })

    except Exception as e:
        return jsonify({'error': f'Error analyzing resume: {str(e)}'}), 500

@app.route('/job-match', methods=['POST'])
def job_match():
    

    data = request.json
    job_description = data.get('jobDescription', '')

    if not job_description:
        return jsonify({'error': 'Job description is required'}), 400

    # Get the QA chain for the uploaded PDF
    qa_chain = get_qa_chain(session['pdf_path'])

    # Create a matching question
    question = f"Based on the following job description, evaluate how well the candidate's skills and experience match. Provide a match percentage and brief explanation. Job description: {job_description}"

    # Perform the question answering
    try:
        result = rag.ask_question(qa_chain, question, return_text=True)

        return jsonify({
            'success': True,
            'match_analysis': result.get('answer', '')
        })
    except Exception as e:
        return jsonify({'error': f'Error matching job: {str(e)}'}), 500


@app.route('/clear', methods=['POST'])
def clear_session():
    # Clear the current session
    session.clear()
    initialize_session()
    return jsonify({'success': True})


if __name__ == '__main__':
    # Modify the rag module to return text instead of printing
    def modified_ask_question(qa_chain, question, return_text=False):
        try:
            result = qa_chain(question)
            return {
                "answer": result['result'],
                "source_documents": result.get('source_documents', [])
            }
        except Exception as e:
            return {"error": str(e)}
    
    rag.ask_question = modified_ask_question
    app.run(debug=True)