<template>
  <div class="about-page">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="main-title">About Import.Food</h1>
        <p class="subtitle">Bringing delicious recipes to your table</p>
      </div>
      <div class="hero-decoration">
        <div class="floating-icon">🍽️</div>
        <div class="floating-icon">👨‍🍳</div>
        <div class="floating-icon">🥗</div>
      </div>
    </div>
    
    <div class="content-section">
      <div class="team-card">
        <h2 class="section-title">Meet Our Team</h2>
        <div class="team-grid">
          <div class="team-member">
            <div class="member-avatar">
              <span class="avatar-text">Y</span>
            </div>
            <div class="member-info">
              <h3>Yuval</h3>
              <p class="member-role">BI Developer at Intel</p>
              <p class="member-description">Information Systems Engineering student passionate about data analytics and business intelligence.</p>
            </div>
          </div>
          
          <div class="team-member">
            <div class="member-avatar">
              <span class="avatar-text">G</span>
            </div>
            <div class="member-info">
              <h3>Guy</h3>
              <p class="member-role">Data Engineer at Wix</p>
              <p class="member-description">Information Systems Engineering student specializing in data engineering and scalable systems.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="project-card">
        <h2 class="section-title">Our Mission</h2>
        <div class="mission-content">
          <div class="mission-text">
            <p>We're passionate about technology, data, and building useful web applications that make life easier. Import.Food was created to help food lovers discover, save, and share amazing recipes from around the world.</p>
            
            <p>This project combines our love for cooking with our technical expertise, featuring recipe discovery, personal recipe creation, and family recipe preservation - all in one beautiful, modern platform.</p>
            
            <p>Developed as part of our Information Systems Engineering studies, we hope you enjoy exploring and using Import.Food as much as we enjoyed building it!</p>
          </div>
          
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">🔍</div>
              <h4>Discover</h4>
              <p>Find recipes from around the world</p>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">📝</div>
              <h4>Create</h4>
              <p>Add your own personal recipes</p>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">❤️</div>
              <h4>Save</h4>
              <p>Keep your favorite recipes</p>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">👨‍👩‍👧‍👦</div>
              <h4>Share</h4>
              <p>Preserve family traditions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
};
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.hero-section {
  position: relative;
  text-align: center;
  margin-bottom: 3rem;
  padding: 3rem 0;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.main-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 0 4px 8px rgba(0,0,0,0.3);
  background: linear-gradient(45deg, #ffffff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.3rem;
  color: rgba(255,255,255,0.9);
  margin-bottom: 0;
  font-weight: 300;
}

.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.floating-icon {
  position: absolute;
  font-size: 3rem;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.floating-icon:nth-child(1) {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.floating-icon:nth-child(2) {
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.floating-icon:nth-child(3) {
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.content-section {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.team-card, .project-card {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,0.2);
}

.section-title {
  font-size: 2.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 2px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.team-member {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255,255,255,0.7);
  border-radius: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.team-member:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0,0,0,0.15);
}

.member-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.avatar-text {
  font-size: 2rem;
  font-weight: bold;
  color: white;
}

.member-info h3 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.member-role {
  font-size: 1rem;
  color: #667eea;
  font-weight: 500;
  margin-bottom: 0.8rem;
}

.member-description {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.mission-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}

.mission-text p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #555;
  margin-bottom: 1.5rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.feature-item {
  text-align: center;
  padding: 1.5rem;
  background: rgba(255,255,255,0.8);
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: scale(1.05);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-item h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.feature-item p {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .about-page {
    padding: 1rem;
  }
  
  .main-title {
    font-size: 2.5rem;
  }
  
  .team-card, .project-card {
    padding: 1.5rem;
  }
  
  .team-member {
    flex-direction: column;
    text-align: center;
  }
  
  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

@media (min-width: 768px) {
  .mission-content {
    grid-template-columns: 1.2fr 1fr;
    align-items: start;
  }
}
</style> 