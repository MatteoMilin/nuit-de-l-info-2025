import { useEffect } from "react";
import '../style/Generic.css';

export function BecomePage() {
  useEffect(() => {
    const targets = document.querySelectorAll("p, li");

    targets.forEach(el => {
      transformTextNode(el);
    });

    function transformTextNode(element) {
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      const textNodes = [];
      let node;

      while ((node = walker.nextNode())) {
        textNodes.push(node);
      }

      textNodes.forEach(textNode => {
        const text = textNode.textContent;
        if (!text.includes("s")) return;

        const fragment = document.createDocumentFragment();
        const parts = text.split(/(s)/g);

        parts.forEach(part => {
          if (part === "s") {
            const link = document.createElement("a");
            link.href = "/snake";
            link.textContent = "s";
            link.style.all = "unset";

            fragment.appendChild(link);
          } else {
            fragment.appendChild(document.createTextNode(part));
          }
        });

        textNode.parentNode.replaceChild(fragment, textNode);
      });
    }
  }, []);
  return (
    <div className="container">
      <h1 className="title">Devenir un village techno-gaulois</h1>

      <p className="text">
        Un établissement n'a pas besoin de tout changer d'un coup :
        il peut avancer par petits pas, comme dans un jeu de rôle progressif.
      </p>

      <p className="text">Voici quelques étapes :</p>

      <ul className="list">
        <li>
          Installer Linux sur un parc d'ordinateurs en fin de vie pour leur redonner
          5 à 10 ans de durée supplémentaire.
        </li>

        <li>
          Remplacer progressivement les logiciels propriétaires par des alternatives libres.
        </li>

        <li>
          Créer une équipe “Techno-gauloise” : élèves + profs + techs + direction.
        </li>

        <li>
          Documenter ses actions sur la Forge des Communs Numériques Éducatifs.
        </li>

        <li>
          Organiser un atelier de sensibilisation à la sobriété numérique.
        </li>
      </ul>

      <p className="text">
        Chaque pas compte.
        Chaque action renforce le village.
      </p>
    </div>
  );
}
