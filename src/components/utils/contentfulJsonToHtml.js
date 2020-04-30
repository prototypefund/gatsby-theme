import React, { useState } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { INLINES, BLOCKS } from '@contentful/rich-text-types';
import {
  CampainVisualisation,
  CrowdFundingVisualistation,
} from '../CampaignVisualisations';
import { LinkButton, LinkButtonLocal, Button } from '../Forms/Button';
import { getMailtoUrl, objectMap } from '.';

export function contentfulJsonToHtml(json) {
  const website_url = 'https://www.change.org';

  const documentToREactComponentsOptions = {
    // needed so that line breaks are properly added.
    renderText: text => {
      return text.split('\n').reduce((children, textSegment, index) => {
        return [...children, index > 0 && <br key={index} />, textSegment];
      }, []);
    },
    renderNode: {
      [INLINES.HYPERLINK]: node => {
        return (
          <a
            href={node.data.uri}
            target={`${
              node.data.uri.startsWith(website_url) ||
              node.data.uri.endsWith('.pdf')
                ? '_blank'
                : '_self'
            }`}
          >
            {node.content[0].value}
          </a>
        );
      },
      [BLOCKS.EMBEDDED_ENTRY]: ({
        data: {
          target: {
            sys: {
              contentType: {
                sys: { id: contentTypeId },
              },
            },
            fields,
          },
        },
      }) => {
        const fieldsMapped = objectMap(fields, field => field['en-US']);
        if (contentTypeId === 'campainVisualisation') {
          return <CrowdFundingVisualistation {...fieldsMapped} />;
        }
        if (contentTypeId === 'callToActionButton') {
          if (fieldsMapped.linkLong) {
            return (
              <p>
                <LinkButton
                  href={fieldsMapped.linkLong}
                  target={fieldsMapped.openInNewTab ? '_blank' : null}
                >
                  {fieldsMapped.text}
                </LinkButton>
              </p>
            );
          } else if (fieldsMapped.internalReference) {
            const referenseFieldsMapped = objectMap(
              fieldsMapped.internalReference.fields,
              field => field['en-US']
            );

            const jumpToAppendix = fieldsMapped.jumpTo
              ? `#${fieldsMapped.jumpTo}`
              : '';

            return (
              <p>
                <LinkButtonLocal
                  to={referenseFieldsMapped.slug + jumpToAppendix}
                  target={fieldsMapped.openInNewTab ? '_blank' : null}
                >
                  {fieldsMapped.text}
                </LinkButtonLocal>
              </p>
            );
          } else if (fieldsMapped.mailto) {
            const href = getMailtoUrl(
              fieldsMapped.mailto === 'BLANK' ? '' : fieldsMapped.mailto,
              fieldsMapped.mailtoSubject,
              fieldsMapped.mailtoBody
            );

            return (
              <p>
                <LinkButton href={href}>{fieldsMapped.text}</LinkButton>
              </p>
            );
          } else if (fieldsMapped.copyToClipboard) {
            return (
              <p>
                <CopyToClipboardButton toCopy={fieldsMapped.copyToClipboard}>
                  {fieldsMapped.text}
                </CopyToClipboardButton>
              </p>
            );
          }
        }
      },
      [BLOCKS.EMBEDDED_ASSET]: node => {
        // https://github.com/contentful/rich-text/issues/61#issuecomment-475999852
        const { title, description, file } = node.data.target.fields;
        const mimeType = file['en-US'].contentType;
        const mimeGroup = mimeType.split('/')[0];

        switch (mimeGroup) {
          case 'image':
          // return (
          //   <img
          //     title={title ? title['en-US'] : null}
          //     alt={description ? description['en-US'] : null}
          //     src={file['en-US'].url}
          //   />
          // );
          case 'application':
            return (
              <p>
                <a
                  target="_blank"
                  alt={description ? description['en-US'] : null}
                  href={file['en-US'].url}
                >
                  {title ? title['en-US'] : file['en-US'].details.fileName}
                </a>
              </p>
            );
          default:
            return (
              <span style={{ backgroundColor: 'red', color: 'white' }}>
                {' '}
                {mimeType} embedded asset{' '}
              </span>
            );
        }
      },
    },
  };

  return documentToReactComponents(json, documentToREactComponentsOptions);
}

function CopyToClipboardButton({ children, toCopy }) {
  const [hasCopied, setHasCopied] = useState(false);

  const copy = () => {
    setHasCopied(true);
    navigator.clipboard.writeText(toCopy);

    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <Button onClick={copy}>
      {hasCopied ? 'Ist in der Zwischenablage!' : children}
    </Button>
  );
}
