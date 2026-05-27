import './About.css'

export default function About() {
  return (
    <main className="simple-page">
      <div className="container">
        <div className="section-eyebrow" style={{marginBottom: 16}}>About</div>
        <h1 className="simple-page__title">Buinho Associação Criativa</h1>
        <div className="simple-page__body">
          <p>Buinho is a rural FabLab, artist residency, and creative ecosystem based in Messejana, Baixo Alentejo, Portugal. Founded in 2015, Buinho pioneered the integrated FabLab + Artist-in-Residence model in Portugal and has been coordinating and participating in European cooperation projects since 2018.</p>
          <p>Our work sits at the intersection of maker culture, contemporary art, inclusive education, and rural development. We believe that small towns can be laboratories for European futures.</p>
          <p><a href="https://buinho.pt" target="_blank" rel="noreferrer" style={{color:'var(--buinho-blue)'}}>Visit buinho.pt →</a></p>
        </div>
      </div>
    </main>
  )
}
