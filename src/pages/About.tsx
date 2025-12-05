import { useEffect } from "react";
import '../style/Generic.css';

export function AboutPage() {
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
      <h1 className="title">À propos</h1>

      <p className="text">
        Bienvenue dans cette application !
        Ce projet a été conçu pour vous permettre de mieux comprendre les enjeux,
        les possibiltés de redonner vie ou prolonger le numérique existant, le
        tout dans une atmosphère inspirée des vieilles consoles.
      </p>

      <p className="text">
        L'objectif est de montrer comment il est possible d'économiser des ressources,
        de comprendre l'environement qui nous entoure et le prolonger.
      </p>
    </div>
  );
}
