import React, { useCallback } from 'react';
import s from './style.module.less';

export default ({ url }) => {
  const placeholder = useCallback(node => {
    if (node !== null) {
      const scriptNode = document
        .createRange()
        .createContextualFragment(twitterEmbed).firstChild;
      node.appendChild(scriptNode);
    }
  }, []);

  return (
    <div className={s.container}>
      <a
        className="twitter-timeline"
        data-dnt="true"
        data-theme="light"
        data-tweet-limit="2"
        data-chrome="nofooter noborders  transparent"
        href={url}
      >
        Du hast den Twitter-Embed geblockt. Kein Problem – hier geht‘s direkt zu
        unseren Neuigkeiten.
      </a>
      <div ref={placeholder} />
    </div>
  );
};

const twitterEmbed = `<script
  async
  src="https://platform.twitter.com/widgets.js"
  charset="utf-8"
></script>
`;
