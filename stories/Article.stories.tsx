import type {Meta, StoryObj} from '@storybook/react'

import {Article} from '../app/components/Article'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export


const example = {
    "title": "Example with all the formatting",
    "pageid": "0",
    "text": "<div><p>A fairly good representation of how we want this answer to render inside the UI can found <a href=\"https://gist.github.com/ChrisRimmer/47699b065053060b5a67a1f2a968af98\" target=\"_blank\" rel=\"noreferrer\">here</a>, rendered using Github’s Gist renderer. Note that the iframe video embed doesn’t work there, but (almost?) everything else does. Or rather, everything that’s actually been implemented in our own markdown generator is supported! Example to <a href=\"/?state=6194&amp;question=Is%20AI%20safety%20about%20systems%20becoming%20malevolent%20or%20conscious%20and%20turning%20on%20us%3F\" target=\"_blank\" rel=\"noreferrer\">another gdoc on the site</a>.</p>\n<p><code>some(inline).code</code></p>\n<p>&lt;div class=”bla bla”&gt;HTML code gets escaped&lt;/div&gt;</p>\n<p>Test the glossary - words that are known, like “agent” should have definitions attached. This should work for like the control problem, s-risk and Goodhart's law. Link with glossary items, e.g. <a href=\"https://aisafety.info/?state=7595_\" target=\"_blank\" rel=\"noreferrer\">what even is an agent</a>, should be glossarified. Agent-like should not count as agent. Nor should the actual <a href=\"https://www.alignmentforum.org/posts/9pZtvjegYKBALFnLk/characterizing-real-world-agents-as-a-research-meta-strategy\" target=\"_blank\" rel=\"noreferrer\">url of links</a>. Words should be case insensitive, like AgEnT should work. Aliases, like the big G should also work.</p>\n<pre><code>  but this will be shown\n</code></pre>\n<iframe src=\"https://www.youtube.com/embed/JD_iA7imAPs\" title=\"There's No Rule That Says We'll Make It\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" allowfullscreen></iframe>\n<p>&lt;- YouTube embed using <a href=\"https://www.youtube-nocookie.com/embed/hEUO6pjwFOo\" target=\"_blank\" rel=\"noreferrer\">https://www.youtube-nocookie.com/embed/hEUO6pjwFOo</a></p>\n<p><a href=\"https://www.youtube.com/shorts/ecUodmQMlBs\" target=\"_blank\" rel=\"noreferrer\">$100,000 for Tasks Where Bigger AIs Do Worse Than Smaller Ones #short - YouTube</a> &lt;- Short embed (no card is available)</p>\n<p>How about Youtube Shorts?<a href=\"https://www.youtube.com/shorts/4LlGJd2OhdQ\" target=\"_blank\" rel=\"noreferrer\">https://www.youtube.com/shorts/4LlGJd2OhdQ</a></p>\n<p>This <a href=\"https://www.youtube.com/watch?v=JD_iA7imAPs\" target=\"_blank\" rel=\"noreferrer\">link to youtube</a> should just be a link though.</p>\n<p>Testing a suggestion of a rich link</p>\n<p>This needs a citation<sup class=\"footnote-ref\"><a href=\"#fn1-0\" target=\"_blank\" rel=\"noreferrer\" id=\"fnref1-0\">[1]</a></sup></p>\n<ol>\n<li>\n<p>Numbered</p>\n</li>\n<li>\n<p>list</p>\n</li>\n</ol>\n<p>And here’s another citation!<sup class=\"footnote-ref\"><a href=\"#fn2-0\" target=\"_blank\" rel=\"noreferrer\" id=\"fnref2-0\">[2]</a></sup></p>\n<p>This footnote has loads of stuff in it to test how it renders<sup class=\"footnote-ref\"><a href=\"#fn3-0\" target=\"_blank\" rel=\"noreferrer\" id=\"fnref3-0\">[3]</a></sup></p>\n<p><img src=\"https://imagedelivery.net/iSzP-DWqFIthoMIqTB4Xog/411d2503-429d-4a5f-8776-ee534d928100/public\" alt=\"Example description\" title=\"Example title\">\nImages!</p>\n<p><img src=\"https://imagedelivery.net/iSzP-DWqFIthoMIqTB4Xog/2370974d-8962-4c6f-0e32-0c775e7b8c00/public\" alt=\"\">\nTest image please do not accept</p>\n<p>Some links to other answers! Link to another answer as an <a href=\"https://aisafety.info?state=8486_\" target=\"_blank\" rel=\"noreferrer\">internalish link</a> or <a href=\"/?state=6194&amp;question=Is%20AI%20safety%20about%20systems%20becoming%20malevolent%20or%20conscious%20and%20turning%20on%20us%3F\" target=\"_blank\" rel=\"noreferrer\">as a gdoc link</a>. (only the last really needs to work as opening the relevant question as a UI element, but first is a nice bonus)<sup class=\"footnote-ref\"><a href=\"#fn4-0\" target=\"_blank\" rel=\"noreferrer\" id=\"fnref4-0\">[4]</a></sup></p>\n<p><a href=\"/?state=6194&amp;question=Is%20AI%20safety%20about%20systems%20becoming%20malevolent%20or%20conscious%20and%20turning%20on%20us%3F\" target=\"_blank\" rel=\"noreferrer\">Is this about AI systems becoming malevolent or conscious and turning on us?</a> or alternatively this kind of link. Much less important, but if trivial may as well cover it.</p>\n<p>```</p>\n<p>Heading 1 | Heading 2 | Heading 3</p>\n<hr>\n<p>Row 1.1   | Row 1.2   | Row 1.3</p>\n<p>Row 2.1   | Row 2.2   | Row 2.3</p>\n<p>```</p>\n<p>Some bulletpoints</p>\n<ul>\n<li>\n<p><strong>bold</strong>, plain <em>italic</em> <a href=\"https://80000hours.org/problem-profiles/artificial-intelligence/#power-seeking-ai\" target=\"_blank\" rel=\"noreferrer\">link</a>, <u>underlined</u></p>\n<ol>\n<li>\n<h3>Level 2 nested bullet which is also a heading and contains a <a href=\"https://www.alignmentforum.org/posts/FWvzwCDRgcjb9sigb/why-agent-foundations-an-overly-abstract-explanation\" target=\"_blank\" rel=\"noreferrer\">link</a></h3>\n</li>\n<li>\n<p>WHY IS THIS ALSO PREFIXED AS a. IN THE DOC</p>\n</li>\n</ol>\n</li>\n<li>\n<p>testing</p>\n</li>\n<li>\n<p>…</p>\n</li>\n</ul>\n<h2>A heading with some <strong>bold</strong> bits and some <em>italic</em> bits and a <a href=\"https://example.com\" target=\"_blank\" rel=\"noreferrer\">link</a> to something and a <em><strong><a href=\"https://example.com\" target=\"_blank\" rel=\"noreferrer\">bit that’s all three</a></strong></em></h2>\n<p><a href=\"https://www.lesswrong.com/posts/WKGZBCYAbZ6WGsKHc/love-in-a-simbox-is-all-you-need#comments\" target=\"_blank\" rel=\"noreferrer\">Actually external link</a>!</p>\n<p><a href=\"https://www.lesswrong.com/posts/WKGZBCYAbZ6WGsKHc/love-in-a-simbox-is-all-you-need#comments\" target=\"_blank\" rel=\"noreferrer\">Consequent links that point to the same thing should be merged into one</a></p>\n<p><strong>Bold</strong>, <em>italic</em>, <u>underlined</u>, <em><strong><u>bold + italic + underline</u></strong></em></p>\n<blockquote>\n<p>This is a quote</p>\n</blockquote>\n<blockquote></blockquote>\n<blockquote>\n<p>This is a second line of the same quote.</p>\n</blockquote>\n<blockquote>\n<p>This will be on the same line as “This is a second line” etc</p>\n</blockquote>\n<blockquote>\n<p>This is a second, separate quote</div>\n           <a href=\"\" class=\"see-more\"></a>\n           <div class=\"see-more-contents\">&lt;- Marker for dividing the answer with a show more JS thing.</p>\n</blockquote>\n<p>Pulling tags from LW/EAF:</p>\n<p><a href=\"https://www.lesswrong.com/tag/optimization\" target=\"_blank\" rel=\"noreferrer\">https://www.lesswrong.com/tag/optimization</a></p>\n<p>-&gt; https://www.lesswrong.com/graphql?query={%20tag(input:%20{selector:%20{slug:%20%22<u>optimization</u><strong>%22} })%20{%20result%20{%20description%20{%20html%20draftJS%20}%20}%20}%20} -&gt; extract the data “</strong><u>html</u>”</p>\n<p><a href=\"https://forum.effectivealtruism.org/topics/existential-risk\" target=\"_blank\" rel=\"noreferrer\">https://forum.effectivealtruism.org/topics/existential-risk</a></p>\n<p>-&gt; https://forum.effectivealtruism.org/graphql?query={%20tag(input:%20{selector:%20{slug:%20%22<u>existential-risk</u><strong>%22} })%20{%20result%20{%20description%20{%20html%20draftJS%20}%20}%20}%20} -&gt; extract the data “</strong><u>html</u>”</p>\n<hr>\n<hr class=\"footnotes-sep\">\n<section class=\"footnotes\">\n<ol class=\"footnotes-list\">\n<li id=\"fn1-0\" class=\"footnote-item\"><p>Here it is <a href=\"#fnref1-0\" target=\"_blank\" rel=\"noreferrer\" class=\"footnote-backref\">↩︎</a></p>\n</li>\n<li id=\"fn2-0\" class=\"footnote-item\"><p>Such cite, many authoritativeness, and a <a href=\"https://www.lesswrong.com/posts/WKGZBCYAbZ6WGsKHc/love-in-a-simbox-is-all-you-need#comments\" target=\"_blank\" rel=\"noreferrer\">link</a>! <a href=\"#fnref2-0\" target=\"_blank\" rel=\"noreferrer\" class=\"footnote-backref\">↩︎</a></p>\n</li>\n<li id=\"fn3-0\" class=\"footnote-item\"><p>ed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?\nAt vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. <a href=\"#fnref3-0\" target=\"_blank\" rel=\"noreferrer\" class=\"footnote-backref\">↩︎</a></p>\n</li>\n<li id=\"fn4-0\" class=\"footnote-item\"><p>This is actually a multi-line footnote\nLet’s see what this does! <a href=\"#fnref4-0\" target=\"_blank\" rel=\"noreferrer\" class=\"footnote-backref\">↩︎</a></p>\n</li>\n</ol>\n</section>\n</div>",
    "answerEditLink": "https://docs.google.com/document/d/10g6U9SL0CBy__wCBTib7_WhB3S3aaFt7Fx1vVgCzg2I/edit",
    "tags": [
      "People"
    ],
    "banners": [
      {
        "title": "In progress",
        "text": "<p>This question is still being worked on, so might not be up to our standards.</p>\n",
        "icon": {
          "@context": "http://schema.org/",
          "@type": "ImageObject",
          "name": "progress.png",
          "height": 800,
          "width": 800,
          "url": "https://codahosted.io/docs/fau7sl2hmG/blobs/bl-TaSoKXXKe4/d8bf8dcbb1af8f1c8eea43216a668ca4b857e8d24a6cfd4a2c3ebcd9ee0cbc51fd2442cdfa0d9dc673221b19a053a260cb14213d86a1937b6be2bcf680e3b166cdaff3278fc922e3a868609ffac2a35a288e93519a04876d4471eaf37859605c1bcbbaef",
          "status": "live"
        },
        "backgroundColour": "#faf3dd",
        "textColour": "#c19242"
      },
      {
        "title": "Controversial",
        "text": "<p>Not everyone agrees with this position.</p>\n",
        "icon": {
          "@context": "http://schema.org/",
          "@type": "ImageObject",
          "name": "warning.png",
          "height": 800,
          "width": 800,
          "url": "https://codahosted.io/docs/fau7sl2hmG/blobs/bl-Ikdaict8oO/8ed66a113c999c2060f61a8140e6dbd3e5f32459b345fb3ddb080f646e2f25949924804a272fa96a7f2d2f28d3d58543dd0de81354906d74c7a1c943207acec774f90b062a4c5a4beb178e99fe50f6202cec7c7fec0055419eaa635bd76e207ded147a86",
          "status": "live"
        },
        "backgroundColour": "#faecec",
        "textColour": "#c2564c"
      },
      {
        "title": "Well established",
        "text": "<p>This is common knowledge.</p>\n",
        "icon": {
          "@context": "http://schema.org/",
          "@type": "ImageObject",
          "name": "check.png",
          "height": 800,
          "width": 800,
          "url": "https://codahosted.io/docs/fau7sl2hmG/blobs/bl-OA9SkAWfYT/1e8e69d8b85b660bdb4dadf8bf16534167010191f0048e62d63127153ab0786a2d2768b38c2993fe5c6a427097a1fae750ac4d833e179b84704f580c5515ed26a6a558eaf7cf178bad8a6b388dc1d560dc126732249eda4afbcf9391dba4c77dafdc8986",
          "status": "live"
        },
        "backgroundColour": "#eef3ed",
        "textColour": "#568064"
      }
    ],
    "relatedQuestions": [
      {
        "title": "Do people seriously worry about existential risk from AI?",
        "pageid": "6953"
      },
      {
        "title": "Can humans stay in control of the world if human- or superhuman-level AI is developed?",
        "pageid": "6201"
      },
      {
        "title": "How could poorly defined goals lead to such negative outcomes?",
        "pageid": "6212"
      }
    ],
    "status": "Dormant",
    "updatedAt": "2024-02-08T16:18:58.449Z",
    "alternatePhrasings": "What formatting options are available?\nWhat kind of markdown does Stampy support?\nGlossaryaaa\nThis is used to define the text to be displayed as the glossary item for this question. It should only be used when theglossary tagis set, otherwise the first paragraph should be used.\nWhen defined here, multiple paragraphs can be used.\nHow do I format answers?"
}

const normal = {
    "title": "Do people seriously worry about existential risk from AI?",
    "pageid": "6953",
    "text": "<p>Many of the people with the deepest understanding of AI are highly concerned about the <a href=\"/?state=8503&amp;question=What%20are%20the%20main%20sources%20of%20AI%20existential%20risk%3F\" target=\"_blank\" rel=\"noreferrer\">risks</a> of unaligned superintelligence.</p>\n<p>The leaders of the world’s top AI labs, along with some of the most prominent academic AI researchers, <a href=\"https://www.safe.ai/statement-on-ai-risk\" target=\"_blank\" rel=\"noreferrer\">have jointly signed a statement</a> expressing that “Mitigating the risk of extinction from AI should be a global priority alongside other societal-scale risks such as pandemics and nuclear war.” This includes <a href=\"https://en.wikipedia.org/wiki/Sam_Altman\" target=\"_blank\" rel=\"noreferrer\">Sam Altman</a> (CEO of OpenAI, the company behind ChatGPT), who has stated that if things go poorly it could be “<a href=\"https://www.businessinsider.com/chatgpt-openai-ceo-worst-case-ai-lights-out-for-all-2023-1\" target=\"_blank\" rel=\"noreferrer\">lights out for all of us</a>”, and DeepMind cofounder Shane Legg, who has said he believes superintelligent AI will be “<a href=\"https://www.vetta.org/documents/Machine_Super_Intelligence.pdf\" target=\"_blank\" rel=\"noreferrer\">something approaching absolute power</a>” and “<a href=\"https://www.lesswrong.com/posts/No5JpRCHzBrWA4jmS/q-and-a-with-shane-legg-on-risks-from-ai\" target=\"_blank\" rel=\"noreferrer\">the number one risk for this century</a>”.</p>\n<p><a href=\"https://en.wikipedia.org/wiki/Stuart_J._Russell\" target=\"_blank\" rel=\"noreferrer\">Stuart Russell</a>, distinguished AI expert and co-author of the “<a href=\"https://en.wikipedia.org/wiki/Artificial_Intelligence:_A_Modern_Approach\" target=\"_blank\" rel=\"noreferrer\">authoritative textbook</a> of the field of AI”, warns of “<a href=\"https://www.edge.org/response-detail/26157\" target=\"_blank\" rel=\"noreferrer\">species-ending problems</a>” and wants his field to pivot to make superintelligence-related risks a central concern. His book <em><a href=\"https://en.wikipedia.org/wiki/Human_Compatible\" target=\"_blank\" rel=\"noreferrer\">Human Compatible</a></em> focuses on the dangers of artificial intelligence and the need for more work to address them.</p>\n<p><a href=\"https://en.wikipedia.org/wiki/Geoffrey_Hinton\" target=\"_blank\" rel=\"noreferrer\">Geoffrey Hinton</a>, one of the “Godfathers of Deep Learning”, <a href=\"https://www.nytimes.com/2023/05/01/technology/ai-google-chatbot-engineer-quits-hinton.html\" target=\"_blank\" rel=\"noreferrer\">resigned</a> from Google <a href=\"https://twitter.com/geoffreyhinton/status/1652993570721210372\" target=\"_blank\" rel=\"noreferrer\">to be able to focus on speaking about the dangers</a> of advancing AI capabilities. <a href=\"https://www.lesswrong.com/posts/bLvc7XkSSnoqSukgy/a-brief-collection-of-hinton-s-recent-comments-on-agi-risk\" target=\"_blank\" rel=\"noreferrer\">He worries about</a> that smarter-than-human intelligence is <a href=\"/?state=5633&amp;question=When%20do%20experts%20think%20human-level%20AI%20will%20be%20created%3F\" target=\"_blank\" rel=\"noreferrer\">no longer far off</a> and he has stated that he thinks that AI wiping out humanity is “<a href=\"https://twitter.com/JMannhart/status/1641764742137016320\" target=\"_blank\" rel=\"noreferrer\">not inconceivable</a>”. <a href=\"https://en.wikipedia.org/wiki/Yoshua_Bengio\" target=\"_blank\" rel=\"noreferrer\">Yoshua Bengio</a>, one of Hinton’s co-recipients for the <a href=\"https://awards.acm.org/about/2018-turing\" target=\"_blank\" rel=\"noreferrer\">2018 Turing Aaward</a>, was not previously concerned by existential risks from AI, but changed his stance in 2023 and <a href=\"https://yoshuabengio.org/2023/05/22/how-rogue-ais-may-arise/\" target=\"_blank\" rel=\"noreferrer\">declared that</a> we need to put more effort into mitigating them.</p>\n<p>Many other science and technology leaders have worried about superintelligence for years. Late astrophysicist <a href=\"https://en.wikipedia.org/wiki/Stephen_Hawking#Future_of_humanity\" target=\"_blank\" rel=\"noreferrer\">Stephen Hawking</a> said in 2014 that superintelligence “<a href=\"https://www.bbc.com/news/technology-30290540\" target=\"_blank\" rel=\"noreferrer\">could spell the end of the human race</a>.”In 2019, <a href=\"https://en.wikipedia.org/wiki/Bill_Gates#Post-Microsoft\" target=\"_blank\" rel=\"noreferrer\">Bill Gates</a> described himself as “<a href=\"https://futurism.com/bill-gates-artificial-intelligence-nuclear-weapons\" target=\"_blank\" rel=\"noreferrer\">in the camp that is concerned about superintelligence”</a> and stated that he “<a href=\"https://futurism.com/bill-gates-artificial-intelligence-nuclear-weapons\" target=\"_blank\" rel=\"noreferrer\">[doesn't] understand why some people are not concerned</a>” and has signed the <a href=\"https://www.safe.ai/statement-on-ai-risk\" target=\"_blank\" rel=\"noreferrer\">Statement on AI risk</a> letter.</p>\n<p>Recently, headline-making large language models such as ChatGPT and the predictions of the respected scientists above have caused many people to join <a href=\"https://en.wikipedia.org/wiki/Snoop_Dogg\" target=\"_blank\" rel=\"noreferrer\">Snoop Dogg</a> in asking, “<a href=\"https://www.youtube.com/shorts/Vt2uvpCvz24\" target=\"_blank\" rel=\"noreferrer\">[are] we in a f*cking movie right now?</a>” This sentiment is understandable, but no, this is not a movie.</p>\n",
    "answerEditLink": "https://docs.google.com/document/d/1PTf4sitz2hMBWn6qFsB88NrEQEl-ItxkdtZGnvTcSxc/edit",
    "tags": [
      "Objections",
      "Plausibility",
      "Actors",
      "Superintelligence",
      "Existential Risk"
    ],
    "banners": [],
    "relatedQuestions": [
      {
        "title": "Is AI safety about systems becoming malevolent or conscious and turning on us?",
        "pageid": "6194"
      },
      {
        "title": "Why might we expect a superintelligence to be hostile by default?",
        "pageid": "6982"
      },
      {
        "title": "When do experts think human-level AI will be created?",
        "pageid": "5633"
      },
      {
        "title": "What are existential risks (x-risks)?",
        "pageid": "89LL"
      }
    ],
    "status": "Live on site",
    "updatedAt": "2024-02-07T18:06:22.771Z",
    "alternatePhrasings": "Does anyone really take this stuff seriously?\nSuperintelligence sounds like sci-fi. Do people think about this in the real world?"
  }


const excessiveTags = {
    "title": "Do people seriously worry about existential risk from AI?",
    "pageid": "6953",
    "text": "<p>Many of the people with</p>\n",
    "answerEditLink": "https://docs.google.com/document/d/1PTf4sitz2hMBWn6qFsB88NrEQEl-ItxkdtZGnvTcSxc/edit",
    "tags": [
        "Objections",
        "Plausibility",
        "Actors",
        "Superintelligence",
        "Existential Risk",
        "Objections",
        "Plausibility",
        "Actors",
        "Superintelligence",
        "Existential Risk",
        "Objections",
        "Plausibility",
        "Actors",
        "Superintelligence",
        "Existential Risk",
      "Objections",
      "Plausibility",
      "Actors",
      "Superintelligence",
      "Existential Risk",
    ],
    "banners": [],
    "relatedQuestions": [
      {
        "title": "Is AI safety about systems becoming malevolent or conscious and turning on us?",
        "pageid": "6194"
      },
      {
        "title": "Why might we expect a superintelligence to be hostile by default?",
        "pageid": "6982"
      },
      {
        "title": "When do experts think human-level AI will be created?",
        "pageid": "5633"
      },
      {
        "title": "What are existential risks (x-risks)?",
        "pageid": "89LL"
      }
    ],
    "status": "Live on site",
    "updatedAt": "2024-02-07T18:06:22.771Z",
    "alternatePhrasings": "Does anyone really take this stuff seriously?\nSuperintelligence sounds like sci-fi. Do people think about this in the real world?"
  }



const meta = {
  title: 'Components/Article',
  component: Article,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof Article>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: normal,
}

export const ExampleWithAll: Story = {
    args: example,
}

export const ExcessiveTags: Story = {
    args: excessiveTags,
}
