# Stampy UI Testing Grounds

- Testing future versions of UI for [stampy.ai](https://stampy.ai/read/Get_involved)
- Using [Remix](https://remix.run/docs) and [Cloudflare Workers](https://developers.cloudflare.com/workers)

1. Setup Requirements

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

4. Create stampy-ui Remix environment

- Change directory to where you downloaded the stampy-ui github repository: `cd stampy-ui`
- Run `npm i` to install all the dependencies required to run the current version of stampy-ui.

5. Either of the following commands generates React component icons from source svg files. If you update svg files
   during development, you can also re-run `npm run generate-icons` manually to see changes.

Once that's done, you should be able to test and deploy your app!

## Development

```sh
$ npm run dev
```

## Deployment

```sh
$ npm run deploy
```

Live demo: https://ui.stampy.ai
