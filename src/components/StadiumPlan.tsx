import { cn } from '@/lib/utils';

interface StadiumSectionDef {
  id: string;
  name: string;
  d: string;
  fill: string;
  labelX: number;
  labelY: number;
  price: number;
  availability: 'available' | 'limited' | 'soldout';
}

interface StadiumPlanProps {
  categories: Array<{
    id: string;
    name: string;
    price: number;
    color: string;
    availability: 'available' | 'limited' | 'soldout';
  }>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function StadiumPlan({ categories, selectedId, onSelect }: StadiumPlanProps) {
  const sectionMap: Record<string, { d: string; labelX: number; labelY: number }> = {
    'cat-1a': { d: 'M 60 180 Q 60 120 120 100 L 180 100 L 180 180 Z', labelX: 115, labelY: 145 },
    'cat-1b': { d: 'M 320 180 L 320 100 L 380 100 Q 440 120 440 180 Z', labelX: 385, labelY: 145 },
    'cat-1c': { d: 'M 180 100 L 320 100 L 320 180 L 180 180 Z', labelX: 250, labelY: 140 },
    'cat-1d': { d: 'M 250 60 L 250 100 M 250 60 m -35 0 a 35 15 0 1 0 70 0 a 35 15 0 1 0 -70 0', labelX: 250, labelY: 50 },
    'cat-2a': { d: 'M 60 180 Q 60 120 120 100 L 180 100 L 180 180 Z', labelX: 115, labelY: 145 },
    'cat-2b': { d: 'M 320 180 L 320 100 L 380 100 Q 440 120 440 180 Z', labelX: 385, labelY: 145 },
    'cat-2c': { d: 'M 180 100 L 320 100 L 320 180 L 180 180 Z', labelX: 250, labelY: 140 },
    'cat-2d': { d: 'M 250 60 L 250 100 M 250 60 m -35 0 a 35 15 0 1 0 70 0 a 35 15 0 1 0 -70 0', labelX: 250, labelY: 50 },
    'cat-3a': { d: 'M 60 180 Q 60 120 120 100 L 180 100 L 180 180 Z', labelX: 115, labelY: 145 },
    'cat-3b': { d: 'M 320 180 L 320 100 L 380 100 Q 440 120 440 180 Z', labelX: 385, labelY: 145 },
    'cat-3c': { d: 'M 180 100 L 320 100 L 320 180 L 180 180 Z', labelX: 250, labelY: 140 },
    'cat-3d': { d: 'M 250 60 L 250 100 M 250 60 m -35 0 a 35 15 0 1 0 70 0 a 35 15 0 1 0 -70 0', labelX: 250, labelY: 50 },
    'cat-4a': { d: 'M 60 180 Q 60 120 120 100 L 180 100 L 180 180 Z', labelX: 115, labelY: 145 },
    'cat-4b': { d: 'M 320 180 L 320 100 L 380 100 Q 440 120 440 180 Z', labelX: 385, labelY: 145 },
    'cat-4c': { d: 'M 180 100 L 320 100 L 320 180 L 180 180 Z', labelX: 250, labelY: 140 },
    'cat-4d': { d: 'M 250 60 L 250 100 M 250 60 m -35 0 a 35 15 0 1 0 70 0 a 35 15 0 1 0 -70 0', labelX: 250, labelY: 50 },
    'cat-5a': { d: 'M 60 180 Q 60 120 120 100 L 180 100 L 180 180 Z', labelX: 115, labelY: 145 },
    'cat-5b': { d: 'M 320 180 L 320 100 L 380 100 Q 440 120 440 180 Z', labelX: 385, labelY: 145 },
    'cat-5c': { d: 'M 180 100 L 320 100 L 320 180 L 180 180 Z', labelX: 250, labelY: 140 },
    'cat-5d': { d: 'M 250 60 L 250 100 M 250 60 m -35 0 a 35 15 0 1 0 70 0 a 35 15 0 1 0 -70 0', labelX: 250, labelY: 50 },
    'cat-6a': { d: 'M 60 180 Q 60 120 120 100 L 180 100 L 180 180 Z', labelX: 115, labelY: 145 },
    'cat-6b': { d: 'M 320 180 L 320 100 L 380 100 Q 440 120 440 180 Z', labelX: 385, labelY: 145 },
    'cat-6c': { d: 'M 180 100 L 320 100 L 320 180 L 180 180 Z', labelX: 250, labelY: 140 },
    'cat-6d': { d: 'M 250 60 L 250 100 M 250 60 m -35 0 a 35 15 0 1 0 70 0 a 35 15 0 1 0 -70 0', labelX: 250, labelY: 50 },
  };

  const sections: StadiumSectionDef[] = categories.map((cat) => {
    const shape = sectionMap[cat.id] || sectionMap['cat-1a'];
    return {
      id: cat.id,
      name: cat.name,
      d: shape.d,
      fill: cat.color,
      labelX: shape.labelX,
      labelY: shape.labelY,
      price: cat.price,
      availability: cat.availability,
    };
  });

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md">
        <svg viewBox="0 0 500 240" className="w-full" role="img" aria-label="Plan du stade">
          {/* Field */}
          <rect x="200" y="195" width="100" height="40" rx="3" fill="#0a5c3a" opacity="0.12" />
          <rect x="200" y="195" width="100" height="40" rx="3" fill="none" stroke="#0a5c3a" strokeWidth="1.5" opacity="0.3" />
          <line x1="250" y1="195" x2="250" y2="235" stroke="#0a5c3a" strokeWidth="1" opacity="0.3" />
          <circle cx="250" cy="215" r="8" fill="none" stroke="#0a5c3a" strokeWidth="1" opacity="0.3" />

          {/* Sections */}
          {sections.map((section) => {
            const isSelected = selectedId === section.id;
            const isSoldOut = section.availability === 'soldout';
            return (
              <g key={section.id}>
                <path
                  d={section.d}
                  className={cn('stadium-section', isSelected && 'stroke-white stroke-2')}
                  fill={section.fill}
                  opacity={isSoldOut ? 0.25 : isSelected ? 1 : 0.7}
                  stroke={isSelected ? '#ffffff' : 'rgba(255,255,255,0.3)'}
                  strokeWidth={isSelected ? 2.5 : 1}
                  onClick={() => !isSoldOut && onSelect(section.id)}
                />
                <text
                  x={section.labelX}
                  y={section.labelY}
                  textAnchor="middle"
                  className="pointer-events-none select-none text-[9px] font-bold"
                  fill={isSoldOut ? '#999' : '#ffffff'}
                >
                  {section.price}€
                </text>
                {isSoldOut && (
                  <text
                    x={section.labelX}
                    y={section.labelY + 12}
                    textAnchor="middle"
                    className="pointer-events-none select-none text-[7px] font-medium"
                    fill="#999"
                  >
                    Complet
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm" style={{ background: '#ff7a2b' }} />
          <span className="text-muted-foreground">Virage</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm" style={{ background: '#fbbf24' }} />
          <span className="text-muted-foreground">Latérale</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm" style={{ background: '#0a5c3a' }} />
          <span className="text-muted-foreground">Principale</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm" style={{ background: '#0d0d0d' }} />
          <span className="text-muted-foreground">VIP</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm opacity-25" style={{ background: '#999' }} />
          <span className="text-muted-foreground">Complet</span>
        </div>
      </div>
    </div>
  );
}
