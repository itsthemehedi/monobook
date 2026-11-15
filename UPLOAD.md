# monobook.co: Upload Guide

**তারিখ:** 15 November 2026
**নিয়ম:** Mehedi লিখিতভাবে "approve" না বললে Production এ deploy করবে না।

এই folder টাই পুরো website। **কোনো Build লাগবে না।** যেমন আছে তেমন Vercel এ upload করো।

| Folder বা File | কী |
|---|---|
| `public/` | তৈরি website (সব Page, ছবি, font) |
| `api/contact.js` | Contact form এর function, mail পাঠায় |
| `vercel.json` | Vercel setting: Build বন্ধ, Output `public`, security header |
| `package.json` | শুধু `"type": "module"`, কোনো dependency নেই |
| `source/` | React + Tailwind code। শুধু পরে কিছু বদলাতে হলে লাগবে (নিচে দেখো) |
| `check-live.sh` | Upload এর পরে check |

---

## 1. Upload (Vercel CLI, সবচেয়ে সহজ)

Zip খোলো। তারপর এই folder এ (যেখানে `vercel.json` আছে) Terminal খুলে:

```bash
npx vercel@latest login
npx vercel@latest deploy
```

- Project এর নাম দাও `monobook-site`।
- কিছু জিজ্ঞেস করলে default রাখো। Setting `vercel.json` থেকে আসবে।

**Git দিয়ে করতে চাইলে:**
1. এই folder এর সব কিছু একটা নতুন repo র **root** এ রাখো।
2. Vercel এ Import করো।
3. Project Settings এ Framework Preset **Other** দাও। Build, Install আর Output Command খালি রাখো।

## 2. Contact form এর key

Vercel > Project > Settings > Environment Variables এ এগুলো দাও (`.env.example` দেখো):

| Name | Value |
|---|---|
| `RESEND_API_KEY` | resend.com থেকে নেওয়া key |
| `CONTACT_TO` | `mehedi@monobook.co` |
| `CONTACT_FROM` | `MonoBook Website <website@monobook.co>` |

- Resend এ monobook.co verify হওয়ার আগে `CONTACT_FROM` এ দাও `MonoBook Website <onboarding@resend.dev>`।
- Key দেওয়ার পর আবার deploy করো: `npx vercel@latest deploy`।
- Key ছাড়াও site চলবে। শুধু form পাঠালে বলবে "That did not send", আর email এর ঠিকানা দেখাবে।

## 3. Check (বাধ্যতামূলক)

```bash
bash check-live.sh https://YOUR-PREVIEW-LINK.vercel.app
```

- শেষে `PASS: site is complete` আসতে হবে।
- `WARNING … RESEND_API_KEY` এলে key বাকি আছে।

তারপর `/contact/` থেকে একটা test form পাঠাও। দেখো mehedi@monobook.co তে mail এসেছে কিনা।

## 4. Live (Mehedi র "approve" এর পরে)

```bash
npx vercel@latest deploy --prod
```

1. Vercel > Settings > Domains এ যাও। পুরানো Project থেকে `monobook.co` আর `www.monobook.co` সরিয়ে এই Project এ যোগ করো।
2. তারপর চালাও:

```bash
bash check-live.sh https://monobook.co
```

## যা করবে না

- এই File গুলো কোনো Vite, Next.js বা React project এর **ভেতরে** রাখবে না। আগের বার এতেই 44টা File missing হয়েছিলো।
- Analytics, Cookie, Pixel বা Chat widget যোগ করবে না।
- API key কোনো File এ লিখবে না।

## পরে লেখা বা design বদলাতে

```bash
cd source
npm install
npm run build
npm run package
```

- লেখা থাকে `source/content/*.json` এ। Code থাকে `source/src/` এ (React + Tailwind)।
- `npm run package` চালালে `source/monobook-site-upload.zip` নামে নতুন zip হয়। সেটা আবার ধাপ 1 এর মতো upload করো।
- বিস্তারিত দেখো `source/README.md` এ।
