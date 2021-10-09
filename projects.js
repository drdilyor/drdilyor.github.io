const projectsElem = document.querySelector('.project-list')
let allProjects = []

for (const projectElem of projectsElem.children) {
  allProjects.push(projectFromDom(projectElem))
}

const filterTags = document.querySelectorAll('.project__tags--filter > li')
const allTags = []
for (const tagElem of filterTags) {
  allTags.push(tagElem.textContent)
}

console.log(allTags)

const appliedTagFilters = new Set()

document.querySelector('.project__tags--filter').addEventListener('click', onTagClick)
projectsElem.addEventListener('click', onTagClick)

function onTagClick(e) {
  if (!e.target.classList.contains('project__tags__item')) {
    return
  }
  if (!e.target.classList.contains('project__tags__item--active')) {
    e.target.classList.add('project__tags__item--active')
    applyTagFilter(e.target.textContent)
  } else {
    e.target.classList.remove('project__tags__item--active')
    removeTagFilter(e.target.textContent)
  }
}

function projectFromDom(elem) {
  return {
    name: elem.querySelector('.project__name').textContent,
    description: elem.querySelector('.project__description').textContent,
    tags: [...elem.querySelectorAll('.project__tags__item')].map(
      tag => tag.textContent,
    ),
    toDom() {
      const elem = document.createElement('article')
      elem.className = 'project'

      const name = document.createElement('h4')
      name.className = 'project__name'
      name.textContent = this.name
      elem.appendChild(name)

      const description = document.createElement('p')
      description.className = 'project__description'
      description.textContent = this.description
      elem.appendChild(description)

      const tags = document.createElement('ul')
      tags.className = 'project__tags'
      for (const tagName of this.tags) {
        const tag = document.createElement('li')
        tag.className = 'project__tags__item'
        if (appliedTagFilters.has(tagName)) {
          tag.classList.add('project__tags__item--active')
        }
        tag.textContent = tagName
        tags.appendChild(tag)
      }
      elem.appendChild(tags)
      return elem
    }
  }
}

function applyTagFilter(tagName) {
  appliedTagFilters.add(tagName)
  renderProjects()
  for (const tagElem of filterTags) {
    if (tagElem.textContent == tagName) {
      tagElem.classList.add('project__tags__item--active')
    }
  }
}

function removeTagFilter(tagName) {
  appliedTagFilters.delete(tagName)
  renderProjects()
  for (const tagElem of filterTags) {
    if (tagElem.textContent == tagName) {
      tagElem.classList.remove('project__tags__item--active')
    }
  }
}

function renderProjects() {
  projectsElem.innerHTML = ''

  if (appliedTagFilters.size == 0) {
    renderAllProjects()
    return
  }

  const filteredProjects = filterProjects()
  console.assert(filteredProjects.length > 0)

  renderFilteredProjects(filteredProjects)
}

function renderAllProjects() {
  // this function exist for its meaningful name
  renderFilteredProjects(allProjects)
}

function renderFilteredProjects(projects) {
  for (const project of projects) {
    projectsElem.appendChild(project.toDom())
  }
}

function filterProjects() {
  const result = []
  nextProject: for (const project of allProjects) {
    for (const tag of project.tags) {
      if (appliedTagFilters.has(tag)) {
        result.push(project)
        continue nextProject
      }
    }
  }
  return result
}
