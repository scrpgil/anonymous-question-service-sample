export const addUser = async (db: any, user: any) => {
  try {
    const now = new Date(user.metadata.creationTime);
    await db.collection('users').doc(user.uid).set({
      name: user.displayName,
      icon: user.photoURL,
      createdAt: now,
      updatedAt: now,
    });
  } catch (e) {
    console.error(e);
  }
  return;
};
