import { useMemo, useState } from 'react';

interface ToolMapping {
  proprietary: string;
  open: string;
  reason: string;
}

interface AlternativeFinderProps {
  onAdopt?: (tool: ToolMapping) => void;
}

export const AlternativeFinder = ({ onAdopt }: AlternativeFinderProps) => {
  const tools = useMemo<ToolMapping[]>(
    () => [
      {
        proprietary: 'Microsoft Office',
        open: 'LibreOffice',
        reason: 'Formats ouverts, pas de licence par poste et compatible avec PrimTux.',
      },
      {
        proprietary: 'Google Chrome',
        open: 'Firefox ESR',
        reason: 'Moteur libre, gestion fine de la vie privée et bonne stabilité en collectivité.',
      },
      {
        proprietary: 'Photoshop',
        open: 'Krita / GIMP',
        reason: 'Outils puissants pour graphistes avec un excellent support tablette.',
      },
      {
        proprietary: 'Teams',
        open: 'Nextcloud Talk',
        reason: "Auto-hébergé, fédérable et adapté aux communications internes de l'établissement.",
      },
      {
        proprietary: 'Windows 10/11',
        open: 'Linux Mint / Debian Edu',
        reason: 'Prolonge la durée de vie des PC tout en restant accessible aux enseignants.',
      },
    ],
    []
  );

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <section className='alternative-finder'>
      <header>
        <h3>Comparateur David vs Goliath</h3>
        <p>Sélectionne un outil pour découvrir sa version résistante et réduire la dépendance aux Big Tech.</p>
      </header>
      <div className='alternative-grid'>
        {tools.map((tool, index) => {
          const isActive = selectedIndex === index;
          return (
            <article
              key={tool.proprietary}
              className={`alternative-card${isActive ? ' is-active' : ''}`}
            >
              <div className='alternative-column bad'>
                <span role='img' aria-label='outil propriétaire'>
                  🚫
                </span>
                <strong>{tool.proprietary}</strong>
              </div>
              <div className='alternative-arrow' aria-hidden='true'>
                ➡️
              </div>
              <div className='alternative-column good'>
                <span role='img' aria-label='solution libre'>
                  ✅
                </span>
                <strong>{tool.open}</strong>
                <p>{tool.reason}</p>
              </div>
              <button
                type='button'
                onClick={() => {
                  setSelectedIndex(index);
                  if (onAdopt) {
                    onAdopt(tool);
                  }
                }}
              >
                Adopter
              </button>
            </article>
          );
        })}
      </div>
      {selectedIndex !== null && (
        <footer className='alternative-footer'>
          <span>
            Excellent choix ! Tu viens de faire reculer la dépendance de {Math.min(15, 5 + selectedIndex * 2)} %.
          </span>
        </footer>
      )}
    </section>
  );
};
