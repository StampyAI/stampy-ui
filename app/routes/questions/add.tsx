import {useState} from 'react'
import type { ActionArgs } from '@remix-run/cloudflare'
import { useActionData, Form, useSearchParams, useSubmit } from '@remix-run/react'
import { redirect } from '@remix-run/cloudflare'
import { addQuestion, loadAllQuestions } from '~/server-utils/stampy'


export const action = async ({ request }: ActionArgs) => {
    const formData = await request.formData();
    let title = formData.get('title')
    const state = formData.get('stateString');
    const redirectTo = '/' + (state ? '?state=' + state : '')
    const relatedQuestions = formData.getAll('relatedQuestion').map(question => ({ title: question }));

    // Make sure that the question was provided
    if (!title) return redirect(redirectTo);

    // Check whether the question is simply a prefix of an existant question,
    // and if so ignore it
    const allQuestions = await loadAllQuestions(request);
    const isPrefix = allQuestions.data.some(
        question => question.toLowerCase().startsWith(title.toLowerCase())
    );
    if (isPrefix) return redirect(redirectTo);

    // Make sure the question is formatted as a question
    if (!title.endsWith('?')) title = title + '?'
    title = title[0].toUpperCase() + title.substring(1);

    const result = await addQuestion(title, relatedQuestions);
    console.log('Added question "' + title + '", response:', result);

    return redirect(redirectTo);
};

export const AddQuestion = ({ title, relatedQuestions, onQuestionAdded }) => {
    const actionData = useActionData<typeof action>();
    const [remixSearchParams] = useSearchParams();
    const [stateString] = useState(() => remixSearchParams.get('state'));

    const submit = useSubmit();

    const handleSubmit = (e) => {
        e.preventDefault();
        submit(e.currentTarget, { replace: true });
        onQuestionAdded(title);
    }

    return (
        <Form method="post"
              action="/questions/add"
              className="result-item none-of-the-above"
              title="Request a new question"
              onSubmit={handleSubmit}
        >
            <input type="hidden" name="title" value={title}/>
            <input type="hidden" name="stateString" value={stateString}/>
            {relatedQuestions.map(title => (
                <input type="hidden"
                       name="relatedQuestion"
                       key={title}
                       value={title}
                />
            ))}
            <button type="submit" className="transparent-button result-item">
                ＋ None of these: Request an answer to my exact question above
            </button>
        </Form>
    )
}
