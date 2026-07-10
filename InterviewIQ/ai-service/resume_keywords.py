"""
Keyword data used by resume_parser.py for heuristic extraction.
Kept separate from the parsing logic so the lists are easy to extend.
"""

# Programming languages, frameworks, tools, databases, and cloud platforms.
# Matched case-insensitively against resume text. Longer/more specific
# entries are listed so "Node.js" doesn't get swallowed by a generic "Node".
TECHNOLOGIES = [
    # Languages
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "C", "Go", "Golang",
    "Rust", "Kotlin", "Swift", "PHP", "Ruby", "Scala", "R", "MATLAB", "Dart",
    # Frontend
    "React", "React.js", "Next.js", "Vue", "Vue.js", "Angular", "Svelte",
    "Redux", "Tailwind CSS", "Tailwind", "Bootstrap", "HTML", "HTML5", "CSS", "CSS3",
    "jQuery", "Sass", "Webpack", "Vite",
    # Backend
    "Node.js", "Express", "Express.js", "Django", "Flask", "FastAPI", "Spring",
    "Spring Boot", "Ruby on Rails", "ASP.NET", ".NET", "GraphQL", "REST API", "gRPC",
    # Databases
    "MongoDB", "MySQL", "PostgreSQL", "SQLite", "Redis", "Cassandra", "DynamoDB",
    "Firebase", "Firestore", "Oracle", "MariaDB", "Elasticsearch", "Supabase",
    # Cloud / DevOps
    "AWS", "Amazon Web Services", "Azure", "Google Cloud", "GCP", "Docker",
    "Kubernetes", "Jenkins", "CI/CD", "Terraform", "Ansible", "Nginx", "Vercel",
    "Netlify", "Heroku", "GitHub Actions", "CircleCI",
    # Data / ML
    "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Keras",
    "OpenCV", "Jupyter", "Spark", "Hadoop", "Tableau", "Power BI",
    # Tools
    "Git", "GitHub", "GitLab", "Bitbucket", "Jira", "Postman", "Figma",
    "Linux", "Bash", "Shell Scripting", "Unix",
    # Mobile
    "React Native", "Flutter", "Android", "iOS", "SwiftUI",
]

# Broader competencies / practices — distinct from concrete technologies above.
SKILLS = [
    "Data Structures", "Algorithms", "Data Structures & Algorithms", "System Design",
    "Object-Oriented Programming", "OOP", "Design Patterns", "Database Design",
    "API Design", "Microservices", "Software Architecture", "Agile", "Scrum",
    "Test-Driven Development", "TDD", "Unit Testing", "Integration Testing",
    "Machine Learning", "Deep Learning", "Natural Language Processing", "NLP",
    "Computer Vision", "Data Analysis", "Data Visualization", "Cloud Computing",
    "DevOps", "Version Control", "Debugging", "Performance Optimization",
    "Problem Solving", "Team Leadership", "Project Management", "Technical Writing",
    "Cross-functional Collaboration", "Mentoring", "Code Review",
]

# Section headings the parser looks for (resume text is uppercased before matching,
# so case in this list doesn't matter).
SECTION_HEADINGS = {
    "projects": ["PROJECTS", "PERSONAL PROJECTS", "ACADEMIC PROJECTS", "PROJECT EXPERIENCE"],
    "education": ["EDUCATION", "ACADEMIC BACKGROUND", "EDUCATIONAL QUALIFICATION"],
    "skills": ["SKILLS", "TECHNICAL SKILLS", "SKILLS & TOOLS", "CORE COMPETENCIES"],
    "experience": ["EXPERIENCE", "WORK EXPERIENCE", "PROFESSIONAL EXPERIENCE", "EMPLOYMENT"],
    "certifications": ["CERTIFICATIONS", "CERTIFICATES", "LICENSES"],
    "summary": ["SUMMARY", "OBJECTIVE", "PROFILE"],
}

DEGREE_PATTERNS = [
    "Bachelor", "B.Tech", "B.E.", "B.Sc", "BS ", "B.S.", "BCA", "B.C.A",
    "Master", "M.Tech", "M.E.", "M.Sc", "MS ", "M.S.", "MCA", "M.C.A",
    "MBA", "PhD", "Ph.D", "Doctorate", "Associate Degree", "Diploma",
]

EDUCATION_KEYWORDS = ["University", "College", "Institute", "Institute of Technology", "School of"]
