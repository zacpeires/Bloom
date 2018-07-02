import { db } from '../../exports.js';
import myFirstProject, { firstProjMetaData } from './myFirstProject';

export const addNewUser = async (userObj, email) => {
  try {
    const newProj = myFirstProject(userObj, email, 'My First Project');
    const { id } = await db.collection('Projects').add(newProj);
    const metadata = firstProjMetaData(userObj, id, 'My First Project');
    await db
      .collection('Users')
      .doc(email)
      .set({
        metadata: userObj,
        projects: {
          [metadata.projectId]: metadata,
        },
      });
  } catch (ee) {
    console.error(ee);
  }
};

export const searchForUser = async email => {
  try {
    const docRef = db.collection('Users').doc(email);
    const user = await docRef.get();
    return user.exists;
  } catch (error) {
    console.error(error);
  }
};

export const addNewProject = async user => {
  try {
    console.log(user);
    const newProj = myFirstProject(
      user.metadata,
      user.metadata.email,
      'New Project'
    );
    const { id } = await db.collection('Projects').add(newProj);
    const metadata = firstProjMetaData(user.metadata, id, 'New Project');
    await db
      .collection('Users')
      .doc(user.metadata.email)
      .update({
        [`projects.${metadata.projectId}`]: metadata,
      });
    return id;
  } catch (error) {
    console.error(error);
  }
};


export const numberOfProjects = user => {
  let counter = 0

  for (let k in user) {
    if (user.hasOwnProperty(k)) {
      counter += 1
    }
  }

  return counter
}
