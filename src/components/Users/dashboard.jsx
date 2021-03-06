import React from 'react';
import firebase from 'firebase';
import { addNewUser, searchForUser, addNewProject } from './function.js';
import ProjectCard from './projectCard';
import './user.css';

import { db } from '../../exports.js';
import history from '../../history';
import DeleteProjectPanel from './DeleteProjectPanel.jsx';
import UserPage from './UserPage.jsx';
import AddProjectCard from './addProjectCard.jsx';

class Dashboard extends React.Component {
  constructor() {
    super();

    this.state = {
      projectName: '',
      nameInput: '',
      project: '',
    };

    this.areYouSure = this.areYouSure.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addProject = this.addProject.bind(this);
  }

  async addProject(user) {
    const id = await addNewProject(user);
    history.push(`/map/${id}`);
  }

  areYouSure(project) {
    this.setState({
      projectName: project.title,
      project: project,
    });
  }

  handleChange(event) {
    this.setState({
      nameInput: event.target.value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (event.target.name === 'delete-btn') {
      if (this.state.projectName === this.state.nameInput) {
        const projectId = this.state.project.projectId;
        const collaborators = this.state.project.collaborators;

        await db
          .collection('Projects')
          .doc(projectId)
          .delete();

        collaborators.forEach(async collaborator => {
          await db
            .collection('Users')
            .doc(collaborator.email)
            .update({
              ['projects.' + projectId]: firebase.firestore.FieldValue.delete(),
            });
        });
      }
    }

    this.setState({
      projectName: '',
      nameInput: '',
    });
  }

  render() {
    if (!this.props.user.metadata) return <div>Loading...</div>;
    const projects = this.props.user.projects;
    const keys = Object.keys(projects);
    return (
      <div id="flexRow">
        <div id="projSet">
          <AddProjectCard addProject={this.addProject} user={this.props.user} />
          {keys.map(project => {
            return (
              <ProjectCard
                key={projects[project].projectId}
                selectMap={this.props.selectMap}
                project={projects[project]}
                areYouSure={this.areYouSure}
                keys={keys}
              />
            );
          })}
        </div>
        <div id="user-page-container">
          <UserPage user={this.props.user} />
        </div>
        {this.state.projectName.length ? (
          <DeleteProjectPanel
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            nameInput={this.state.nameInput}
          />
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default Dashboard;
