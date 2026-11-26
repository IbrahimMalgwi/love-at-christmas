# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Firebase access and public counts

For local development, copy `.env.example` to `.env.local`, fill in the
Firebase web app configuration, and restart `npm start`. Set the same values
in the production build environment. Without this configuration, static pages
still load, while live data and admin sign-in are unavailable. Keep service
account credentials out of the browser and repository.

Before rolling out the app and deploying `firestore.rules` and `storage.rules`,
use Application Default Credentials with permission to manage Firebase Auth
and access Firestore. Grant the admin claim to each existing administrator's
Firebase Auth UID after verifying it. Admins need to sign in again to refresh
their tokens.

```sh
node scripts/firebase-maintenance.cjs grant-admin PROJECT_ID ADMIN_UID
firebase deploy --only firestore:rules,storage --project PROJECT_ID
```

### Publishing campaign content

Open **Admin Dashboard → Campaign** to edit dates, the announcement, volunteer
registration, an approved gallery photo for the homepage, and verified impact.
Save a draft to work privately. **Publish campaign** replaces the public snapshot
that visitors see without a Vercel rebuild. Blank figures are unavailable. An
explicit zero is displayed as zero. The old public stats document may remain for
older clients, but this frontend uses the curated figures in the campaign snapshot.

FAQ edits can also be saved privately and published later. Existing FAQ and gallery
records remain in their original collections. Saving a gallery item publishes it;
use only images approved for public display. The 2025 flyer from the existing public
gallery is bundled as an archive item. The hero uses a festive illustration until
an approved gallery photo is selected. No additional Firestore indexes are required.

Deploy the updated Firestore and Storage rules before using the new dashboard.
Volunteer submissions require a published campaign with registration turned on.
Participant registration stays available under the existing validation rules.
The Firebase environment variables in `.env.example` are required on Vercel for
live data. The live gallery served its flyer from Supabase Storage even though the live
bundle also contained Firebase Auth and Firestore. Confirm the Firebase project
used by Vercel and review any production-only records held separately before
rolling out the redesign.

### Local Firebase preview

Run the Firebase Auth, Firestore and Storage emulators with a demo project:

```sh
firebase emulators:start --project demo-love-at-christmas --only auth,firestore,storage
REACT_APP_USE_FIREBASE_EMULATORS=true \
REACT_APP_FIREBASE_API_KEY=demo-key \
REACT_APP_FIREBASE_PROJECT_ID=demo-love-at-christmas \
REACT_APP_FIREBASE_STORAGE_BUCKET=demo-love-at-christmas.appspot.com npm start
```

The emulator switch requires a development build and a project ID beginning with
`demo-`. Use an Auth emulator account with the `admin` custom claim to test publishing.

### Participant duplicate checks

Participant registration uses the Vercel function at
`/api/participant-registration`. Submissions are matched by normalized full name
and Nigerian phone number across the existing participant collection. Different
names can share a number. The form gives the same confirmation for a new and
an existing registration to keep registration status private.

Set `FIREBASE_SERVICE_ACCOUNT_JSON` as a **server-only**, sensitive Vercel
environment variable for the same Firebase project as the web app. Never use a
`REACT_APP_` prefix for this credential. The `npm start` development server mounts the same handler locally. `vercel dev`
can also run the frontend and function together. For isolated local data, set
`FIRESTORE_EMULATOR_HOST=127.0.0.1:8080` and use the demo project environment
described above.

For rollout, deploy the new Firestore rules to stop the legacy public write
path, then index existing participant records before switching traffic to the
new registration form. There can be a short registration interruption during
this transition. The index command is safe to rerun and keeps existing document
IDs and timestamps. Review any skipped records whose name or phone needs correction.

```sh
node scripts/firebase-maintenance.cjs index-participants PROJECT_ID
```
