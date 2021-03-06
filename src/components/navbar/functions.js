export const displayForm = action => {
  if (action === 'addCollaborator') {
    const formTwo = document.getElementById('save-form');
    if (formTwo.classList.contains('show')) {
      formTwo.classList.toggle('show');
    }
    const formOne = document.getElementById('collab-form');
    formOne.classList.toggle('show');
  } else if (action === 'save') {
    const formOne = document.getElementById('collab-form');
    if (formOne.classList.contains('show')) {
      formOne.classList.toggle('show');
    }
    const formTwo = document.getElementById('save-form');
    formTwo.classList.toggle('show');
  }
};

export const removeForm = () => {
  const formOne = document.getElementById('collab-form');
  const formTwo = document.getElementById('save-form');
  formOne.classList.remove('show');
  formTwo.classList.remove('show');
};

export const checkUnique = (collaborators, collabEmail, userEmail) => {
  return collaborators.filter(person => {
    if (person.email === collabEmail && person.email !== userEmail) {
      return person;
    }
  });
};

export const updateUserProjects = (
  collaborators,
  db,
  projectId,
  owner,
  title
) => {
  collaborators.forEach(async collaborator => {
    const user = await db
      .collection('Users')
      .doc(collaborator.email)
      .get();
    const userData = user.data();

    await db
      .collection('Users')
      .doc(collaborator.email)
      .update({
        projects: {
          ...userData.projects,
          [projectId]: {
            collaborators: [...collaborators],
            owner: owner,
            projectId: projectId,
            title: title,
          },
        },
      });
  });
};
