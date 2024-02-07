import type {Meta, StoryObj} from '@storybook/react'
import {NavBar} from '../app/components/Nav'

const meta = {
  title: 'Components/Nav',
  component: NavBar,
  tags: ['autodocs'],
} satisfies Meta<typeof NavBar>
export default meta
type Story = StoryObj<typeof meta>
export const Primary: Story = {
  args: {
      categories: [
          {rowId: '1', name: 'Superintelligence', tagId: 123, url: '', internal: false, questions: [], mainQuestion: null},
          {rowId: '2', name: 'Alignment', tagId: 123, url: '', internal: false, questions: [], mainQuestion: null},
          {rowId: '3', name: 'Boxing', tagId: 123, url: '', internal: false, questions: [], mainQuestion: null},
          {rowId: '4', name: 'Interpretability', tagId: 123, url: '', internal: false, questions: [], mainQuestion: null},
          {rowId: '5', name: 'ML', tagId: 123, url: '', internal: false, questions: [], mainQuestion: null},
          {rowId: '6', name: 'Oracles', tagId: 123, url: '', internal: false, questions: [], mainQuestion: null},
          {rowId: '7', name: 'FAI', tagId: 123, url: '', internal: false, questions: [], mainQuestion: null},
      ],
      toc: [{
          "title": "New to AI safety? Start here.",
          "subtitle": "Basic information about all of this",
          "pageid": "9OGZ",
          "icon": "https://cdn.builder.io/api/v1/image/assets/TEMP/9769202bfb08a9b87ab3d7e55cff70586447e8f76a8c076fff6f0d4e8902c5da?apiKey=f1073757e44b4ccd8d59791af6c41a77&",
          "hasText": true,
          "children": [
              {
                  "title": "What would an AGI be able to do?",
                  "pageid": "NH50",
                  "hasText": false
              },
              {
                  "title": "Types of AI",
                  "pageid": "NH50",
                  "hasText": false,
                  "children": [
                      {
                          "title": "What are the differences between AGI, transformative AI, and superintelligence?",
                          "pageid": "5864",
                          "hasText": true
                      },
                      {
                          "title": "What is intelligence?",
                          "pageid": "6315",
                          "hasText": true
                      },
                      {
                          "title": "What is artificial general intelligence (AGI)?",
                          "pageid": "2374",
                          "hasText": true
                      },
                      {
                          "title": "What is \"superintelligence\"?",
                          "pageid": "6207",
                          "hasText": true
                      },
                      {
                          "title": "What is artificial intelligence (AI)?",
                          "pageid": "8G1H",
                          "hasText": true
                      }
                  ]
              },
              {
                  "title": "Introduction to ML",
                  "pageid": "NH50",
                  "hasText": false,
                  "children": [
                      {
                          "title": "What are large language models?",
                          "pageid": "8161",
                          "hasText": true
                      },
                      {
                          "title": "What is compute?",
                          "pageid": "9358",
                          "hasText": true
                      }
                  ]
              },
              {
                  "title": "Introduction to AI Safety",
                  "pageid": "NH50",
                  "hasText": false,
                  "children": [
                      {
                          "title": "Why would an AI do bad things?",
                          "pageid": "2400",
                          "hasText": true
                      },
                      {
                          "title": "How likely is extinction from superintelligent AI?",
                          "pageid": "7715",
                          "hasText": true
                      },
                      {
                          "title": "What is AI safety?",
                          "pageid": "8486",
                          "hasText": true
                      },
                      {
                          "title": "Why is safety important for smarter-than-human AI?",
                          "pageid": "6297",
                          "hasText": true
                      }
                  ]
              }
          ]
      }
           ],
  }
}
