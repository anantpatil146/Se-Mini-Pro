const handleJobDescriptionUpload = async () => {
  try {
    const jobDescription = prompt("Please enter the job description:");
    if (!jobDescription) return;

    const response = await fetch('http://localhost:5000/job-match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobDescription }),
    });

    const data = await response.json();
    if (data.success) {
      // Display the match analysis
      alert(data.match_analysis);
    } else {
      alert(data.error || 'Failed to analyze job match');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error analyzing job match');
  }
};

// Add this onClick handler to your button
<button onClick={handleJobDescriptionUpload}>UPLOAD JOB DESCRIPTION</button>