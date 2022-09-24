var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// ProjectList Class
import { autobind } from '../decorators/autobind.js';
import { ProjectStatus } from '../models/project.js';
import { projectState } from '../state/project-state.js';
import { Component } from './base.js';
import { ProjectItem } from './item.js';
export class ProjectList extends Component {
    constructor(type) {
        super('project-list', 'app', false, `${type}-projects`);
        this.type = type;
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }
    dragLeaveHandler(event) {
        const listEl = this.element.querySelector('ul');
        listEl.classList.remove('droppable');
    }
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            // default is to not allow dropping in JS
            event.preventDefault();
            const listEl = this.element.querySelector('ul');
            listEl.classList.add('droppable');
        }
    }
    dropHandler(event) {
        console.log(event.dataTransfer.getData('text/plain'));
        const prjId = event.dataTransfer.getData('text/plain');
        projectState.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
    }
    configure() {
        //eventListeners
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('drop', this.dropHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        projectState.addListener((projects) => {
            const relevantProjects = projects.filter((prj) => {
                if (this.type === 'active') {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }
    renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`);
        listEl.innerHTML = '';
        for (const prjItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul').id, prjItem);
        }
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent =
            this.type.toUpperCase() + ' PROJECTS';
    }
}
__decorate([
    autobind
], ProjectList.prototype, "dragLeaveHandler", null);
__decorate([
    autobind
], ProjectList.prototype, "dragOverHandler", null);
__decorate([
    autobind
], ProjectList.prototype, "dropHandler", null);