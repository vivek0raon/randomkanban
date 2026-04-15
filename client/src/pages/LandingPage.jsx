import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ArrowRight, Zap, Target, Lock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="app-header" style={{ position: 'relative', background: 'transparent', border: 'none', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="app-title" style={{ fontSize: '1.75rem' }}>
          <LayoutDashboard className="app-title-icon" size={32} />
          <span>NovaKanban</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/auth" className="button-primary" style={{ textDecoration: 'none', whiteSpace: 'nowrap', fontSize: 'clamp(0.75rem, 2vw, 0.95rem)' }}>
            <span className="hide-mobile">Login / Get Started</span>
            <span className="show-mobile">Get Started</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </header>
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(2rem, 5vw, 4rem) 1.25rem' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 800, marginBottom: '1.5rem', background: 'linear-gradient(to right, #f8f8f2, #a2aab8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Manage Chaos, <br/>
          <span style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Beautifully.</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '3rem', lineHeight: '1.6' }}>
          The ultimate premium glassmorphic Kanban workspace. Organize your life, categorize multiple projects, track deadlines, and never miss a beat.
        </p>
        
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2rem' }}>
          <FeatureCard 
            icon={<Target size={32} color="var(--accent-emerald)" />} 
            title="Categorized Boards" 
            desc="Segregate work and personal projects seamlessly." 
          />
          <FeatureCard 
            icon={<Zap size={32} color="var(--accent-amber)" />} 
            title="Smart Timers" 
            desc="Set due dates and get automatic browser notifications." 
          />
          <FeatureCard 
            icon={<Lock size={32} color="var(--accent-rose)" />} 
            title="Secure Accounts" 
            desc="Encrypted JWT authentication keeps your workflow private." 
          />
        </div>
      </main>
      
      {/* Decorative floating elements */}
      <div className="glass-card" style={{ position: 'absolute', top: '20%', left: '10%', width: '200px', height: '100px', transform: 'rotate(-10deg)', zIndex: -1, opacity: 0.5 }}></div>
      <div className="glass-card" style={{ position: 'absolute', bottom: '20%', right: '10%', width: '250px', height: '150px', transform: 'rotate(15deg)', zIndex: -1, opacity: 0.5 }}></div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', width: '280px', textAlign: 'left', transition: 'transform 0.3s' }}>
      <div style={{ marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{desc}</p>
    </div>
  );
}
