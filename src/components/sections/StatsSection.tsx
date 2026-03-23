type Stat = { id: string; label: string; value: string; icon?: string | null }

const FALLBACK_STATS: Stat[] = [
  { id: '1', value: '500+', label: 'Graduates Placed', icon: '🎓' },
  { id: '2', value: '15+', label: 'Years of Excellence', icon: '⭐' },
  { id: '3', value: '98%', label: 'Employment Rate', icon: '💼' },
  { id: '4', value: '30+', label: 'Industry Partners', icon: '🤝' },
]

export default function StatsSection({ stats }: { stats?: Stat[] }) {
  const items = stats?.length ? stats : FALLBACK_STATS

  return (
    <section id="stats" className="bg-coffee-950 py-16 relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(200,134,10,0.3) 35px, rgba(200,134,10,0.3) 70px)`,
        }}
      />
      <div className="container-main relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((stat, i) => (
            <div key={stat.id} className="text-center group">
              {stat.icon && (
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
              )}
              <div
                className="text-4xl md:text-5xl font-bold text-espresso-400 mb-2"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-coffee-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
