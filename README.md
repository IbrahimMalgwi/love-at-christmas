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
in the production build environment. Without this configuration, the sign-in page
still loads, while sign-in and portal access are unavailable. Keep service
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

Open **Admin Dashboard → Campaign** to control whether volunteer registration
is open. Draft changes apply only after publishing. Administrators can still
manage archived gallery, FAQ, and campaign content from the dashboard. Home, About, Gallery, FAQ, and Donate are available without signing in;
registration and dashboards require an account.

Deploy the updated Firestore and Storage rules with the portal. Volunteer
submissions require a signed-in account and are open unless an administrator
closes them in the current year’s published campaign. Participant submissions require a signed-in account and
use the Vercel function described below. No new Firestore indexes are required.
Set the Firebase web environment variables on Vercel for the production project.

### Local Firebase preview

Run the Firebase Auth, Firestore and Storage emulators with a demo project:

```sh
firebase emulators:start --project demo-love-at-christmas --only auth,firestore,storage
REACT_APP_USE_FIREBASE_EMULATORS=true \
REACT_APP_FIREBASE_API_KEY=demo-key \
REACT_APP_FIREBASE_PROJECT_ID=demo-love-at-christmas \
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 \
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 \
REACT_APP_FIREBASE_STORAGE_BUCKET=demo-love-at-christmas.appspot.com npm start
```

The emulator switch requires a development build and a project ID beginning with
`demo-`. Use an Auth emulator account with the `admin` custom claim to test publishing.

### Participant duplicate checks

Participant registration uses the Vercel function at
`/api/participant-registration`. Submissions are matched by normalized full name
and Nigerian phone number within the same campaign year. Different
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

### Portal access

Enable Email/Password in Firebase Authentication and create accounts for the
people authorized to register participants or volunteers. New accounts have
standard access. Assign the `admin` custom claim only to administrators using
the maintenance command above. Standard users can open the dashboard and both
registration forms, subject to the volunteer registration setting. Registration
records and management tools are restricted to administrators.

Deploy both Firebase rulesets and the authenticated Vercel registration
function with the portal update. For local testing, also set
`FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099` for the Node registration handler.
Published campaign content, FAQ entries, and gallery images can be read by
visitors. Campaign and FAQ drafts remain restricted to administrators.

### Annual registration records

Participant and volunteer registration are available from the signed-in
registration page. Volunteer registration defaults to open each new year.
Administrators can close it for the current year by updating and publishing
the Campaign settings.

Registrations use the calendar year in Lagos. The dashboard shows all years
by default, grouped by campaign year with the newest year first. Use the
campaign year filter to view and export a specific year. Older records without
a campaign year are grouped by their registration date. Undated records
appear separately. Participant duplicate checks apply
within the same year. Run the participant indexing command above if it has
not already been run on existing records.

If participant submissions report a Firebase connection error, check the
Vercel project’s Logs for `/api/participant-registration` and HTTP 503.
The `stage` field identifies Firebase initialization, ID token verification, or
the Firestore transaction. An initialization failure with
`reason: credentials-missing` means the server has no configured credentials.

In the Vercel project’s Settings → Environment Variables, set
`FIREBASE_SERVICE_ACCOUNT_JSON` to the Firebase service account JSON and mark it
Sensitive. Set `REACT_APP_FIREBASE_PROJECT_ID` to the matching `project_id`.
Apply both variables to Production for the live site, or to Preview for a test
deployment using the test Firebase project. In Deployments, find the affected
deployment, open its menu, and choose Redeploy to apply the new settings.
If deploying a code change too, deploy the updated revision.

For plain `npm start` with live Firebase,
provide server credentials in the ignored `.env.local` or through Application
Default Credentials. Firebase web configuration alone only enables the browser
to sign in. For emulator testing, configure both server emulator hosts.
