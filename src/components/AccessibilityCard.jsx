import './AccessibilityCard.css'

function AccessibilityCard({ icon: Icon, title, description }) 
{
  return (
    <article className="accessibility-card">
      <div className="accessibility-card-icon">
        <Icon size={26} strokeWidth={2} />
      </div>

      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

export default AccessibilityCard