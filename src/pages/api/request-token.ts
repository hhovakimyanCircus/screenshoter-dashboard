import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

import admin from '@/firebase/admin';

export default withApiAuthRequired(async function products(req, res) {
  try {
    const session = await getSession(req, res);

    const customToken = await admin.auth().createCustomToken(session?.user.sub);

    res.status(200).json({
      uid: session?.user.sub,
      customToken,
      userName: session?.user?.name || '',
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
