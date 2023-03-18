![Stampy!](https://github.com/StampyAI/StampyAIAssets/blob/main/profile/stampy-profile-228.png?raw=true)

Stampy UI is an interface for [aisafety.info](https://aisafety.info), a questions and answers site about AGI safety, built with [Remix](https://remix.run/docs) and [Cloudflare Workers](https://developers.cloudflare.com/workers). When reading about existential risks becomes "too serious", we also have a more playful version of the site: [stampy.ai](https://stampy.ai).

Contributions are welcome, the code is released under the MIT License. If you'd like to join the [dev team](https://coda.io/d/AI-Safety-Info_dfau7sl2hmG/Dev-team_sulmV#_luYjG), drop by [our Discord](https://discord.com/invite/7wjJbFJnSN) and post in #stampy-dev!

# Stampy UI Development Setup

1. Requirements

- [Install Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Create Cloudflare account](https://dash.cloudflare.com/sign-up)
- [Install Wrangler CLI](https://developers.cloudflare.com/workers/cli-wrangler/install-update)
  and [authenticate the CLI](https://developers.cloudflare.com/workers/cli-wrangler/authentication)

2. Clone the [Repo](https://github.com/StampyAI/stampy-ui)

- Run `git clone https://github.com/StampyAI/stampy-ui.git`

3. Setup in [Cloudflare Dashboard](https://dash.cloudflare.com/)

- If you haven't already, set up your free custom Cloudflare Workers subdomain
- From the left menu `Workers` : `Overview`, note your Cloudflare` Account ID` on the right
- From the left menu `Workers` : `KV`, create a KV (key-value store) namespace `STAMPY_KV`
- Note the new created `STAMPY_KV` Namespace ID
- Copy `wrangler.toml.template` to `wrangler.toml`
- Replace the values for your `{CLOUDFLARE_ACCT_ID}` and `{STAMPY_KV_ID}` in `wrangler.toml`

4. Setup in [Coda](https://coda.io/account)

- When logged in to Coda, `Generate API token` in your Account settigns
- Add restrictions: `Doc or table`, `Read only`, for the doc with url `https://coda.io/d/_dfau7sl2hmG`
  (you need access to the doc of course, which you can request on the Discord)
- Replace the value for `{CODA_TOKEN}` in `wrangler.toml`

  4.1 Setup write access to the API write view in Coda

  This step is only needed for incrementing counters (helpful, etc.). There isn't a test environment,
  so any changes there will also effect the live site, so think twice before using them.

  - When logged in to Coda, `Generate API token` in your Account settings
  - Add restrictions: `Doc or table`, `Read and Write`, for the table with url `https://coda.io/d/_dfau7sl2hmG#_tutable-eEhx2YPsBE`
  - Replace the value for `{CODA_WRITES_TOKEN}` in `wrangler.toml`

  4.2 Setup write access to the "Incoming questions" table in Coda

  This step is only needed if you want to add new questions to Coda, or you want to mark answers as
  helpful. Seeing as they will then go live, it would probably be better to only set this if you are
  working on those specific component, in order to not mess up the list of incoming questions.

  - When logged in to Coda, `Generate API token` in your Account settigns
  - Add restrictions: `Doc or table`, `Read and Write`, for the table with url `https://coda.io/d/_dfau7sl2hmG`
  - Replace the value for `{CODA_WRITE_TOKEN}` in `wrangler.toml`

5. Create stampy-ui Remix environment

- Change directory to where you downloaded the stampy-ui github repository: `cd stampy-ui`
- Run `npm install` to install all the dependencies required to run the current version of stampy-ui.

Once that's done, you should be able to test and deploy your app!

## Local Development

```
$ npm run dev
```

## Lint and Tests

```
$ npm run lint
$ npm run test
```

## Deployment to your CF Worker

```
$ npm run deploy
```

Production domains are deployed via GitHub Actions.

## Add a new domain

- log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) owned by @plexish
- use `Add a site` button on homepage, choose the Free plan
  - in the DNS section for this site > `Add record` for 2 new CNAME records:
  - `CNAME @ stampy-ui.stampy.workers.dev`
  - `CNAME * stampy-ui.stampy.workers.dev`
- go to Workers > stampy-ui > [Triggers](https://dash.cloudflare.com/841738ad455064a5846675cc41124c85/workers/services/view/stampy-ui/production/triggers)
  - in Routes section > `Add route` with the new domain (e.g. `example.com/*` and select the zone to the just-added site)
- [update your domain registrar](https://developers.cloudflare.com/fundamentals/get-started/setup/add-site/#update-your-registrar) to enable CF
- check the site after a few minutes (CF claims "up to 24 hours", it's usually faster ... but don't share the link too widely on the first day)
