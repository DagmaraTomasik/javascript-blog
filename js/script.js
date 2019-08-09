'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
};

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;

  /* [DONE] remove class 'active' from all article links  */

  const activeLink = document.querySelector('.titles a.active');
  activeLink.classList.remove('active');

  /* [DONE] add class 'active' to the clicked link */

  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */

  const activeArticle = document.querySelector('.posts article.active');
  activeArticle.classList.remove('active');

  /* get 'href' attribute from the clicked link */

  const artcileSelector = clickedElement.getAttribute('href');

  /* find the correct article using the selector (value of '' attribute) */

  const targetArticle = document.querySelector(artcileSelector);

  /* add class 'active' to the correct article */

  targetArticle.classList.add('active');
}

/* */

function generateTitleLinks(customSelector = '') {

  /* remove contents of titleList */

  const titleList = document.querySelector(optTitleListSelector);

  titleList.innerHTML = ' ';

  /* for each article */

  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html = ' ';

  for(let article of articles){

    /* get the article id */

    const articleId = article.getAttribute('id');

    /* find the title element */

    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* get the title from the title element */

    /* create HTML of the link [NEW] */

    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);

    /* insert link into titleList */

    titleList.insertAdjacentHTML('afterbegin', linkHTML);

    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }

  document.querySelector('.titles a').classList.add('active');
}

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles';

generateTitleLinks();

const optArticleTagsSelector = '.post-tags .list';
const optArticleTagsElementSelector = '.posts .list li';
const optTagsListSelector = '.tags.list';
const optCloudClassCount = 5;
const optCloudClassPrefix = 'tag-size-';

function calculateTagsParams(tags){

  const params = {max: '0', min: '999999'};

  for(let tag in tags){
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    else if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params){

  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );

  return classNumber;

}

function generateTags(){

  /* [NEW] create a new variable allTags with an empty object */

  let allTags = {};

  /* find all articles */

  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */

  for (let article of articles){

    /* find tags wrapper */

    const tagsWrapper = article.querySelector(optArticleTagsSelector);

    /* make html variable with empty string */

    let html = ' ';

    /* get tags from data-tags attribute */

    const articleTags = article.getAttribute('data-tags');

    /* split tags into array */

    const articleTagsArray = articleTags.split(' ');

    /* START LOOP: for each tag */

    for (let tag of articleTagsArray){

      /* generate HTML of the link */

      const linkHTMLData = {tag: tag, title: tag};
      const linkHTML = templates.tagLink(linkHTMLData);

      /* add generated code to html variable */

      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allTags */

      if(!allTags.hasOwnProperty(tag)){

        /* [NEW] add tag to allTags object */

        allTags[tag]=1;
      }else {
        allTags[tag]++;
      }

      /* END LOOP: for each tag */

    }

    /* [NEW] find list of tags in right column */

    const tagList = document.querySelector('.tags');

    const tagsParams = calculateTagsParams(allTags);

    /* [NEW] create variable for all links HTML code */

    const allTagsData = {tags: [ ]};

    /* [NEW] START LOOP: for each tag in allTags */

    for(let tag in allTags){

      /* [NEW] generate code of a link and add it to allTagsHTML */

      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });

      /* [NEW] END LOOP: for each tag in allTags */

    }

    /* [NEW] add html from allTagsHTML to tagList */

    tagList.innerHTML = templates.tagCloudLink(allTagsData);

    /* insert HTML of all the links into the tags wrapper */

    tagsWrapper.insertAdjacentHTML('beforeend', html);

    /* END LOOP: for every article: */

  }

  console.log('Zakonczylem generowanie tagów');

}

generateTags();

function tagClickHandler(event){

  /* prevent default action for this event */

  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const href = clickedElement.getAttribute('href');

  //const href = link.getAttribute(href);

  /* make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */

  const activeLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  //const href = link.getAttribute(href);

  /* START LOOP: for each active tag link */

  for (let activeTagLink of activeLinks){

    /* remove class active */

    activeTagLink.classList.remove('active');

    /* END LOOP: for each active tag link */

  }

  /* find all tag links with "href" attribute equal to the "href" constant */

  const equalTagLinks = document.querySelectorAll('html');

  /* START LOOP: for each found tag link */

  for (let foundTagLink of equalTagLinks){

    /* add class active */

    foundTagLink.classList.add('active');

    /* END LOOP: for each found tag link */

  }

  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {

  /* find all links to tags */

  const links = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */

  for (let link of links){

    link.addEventListener('click', tagClickHandler);

  /* END LOOP: for each link */
  }
}
addClickListenersToTags();

const optArticleAuthorSelector = '.post-author';
const optAuthorsListSelector = '.authors';
const optAuthorClassCount = 2;
const optAuthorClassPrefix = 'author-size-';

function calculateAuthorsParams(authors){

  const params = {max: '0', min: '999999'};

  for(let author in authors){
    if(authors[author] > params.max){
      params.max = authors[author];
    }
    else if(authors[author] < params.min){
      params.min = authors[author];
    }
  }
  return params;
}

function calculateAuthorsClass(count, params){

  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );

  return classNumber;

}

function generateAuthors(){

  /* [NEW] create a new variable allAuthors with an empty object */

  let allAuthors = {};

  /* find all authors */

  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article */

  for (let article of articles){
  /* find author wrapper*/

    const authorWrapper = article.querySelector(optArticleAuthorSelector);

    /* make html variable with empty string */

    let html = ' ';

    /* get author from data-authot attribute */

    const articleAuthor = article.getAttribute('data-author');

    /* generate HTML of the link */

    const linkHTMLData = {articleAuthor: articleAuthor, title: articleAuthor};
    const linkHTML = templates.authorLink(linkHTMLData);

    /* add generated code to html variable */

    html = html + linkHTML;

    /* [NEW] check if this link is NOT already in allAuthors */

    if(!allAuthors.hasOwnProperty(articleAuthor)){

      /* [NEW] add author to allAuthors object */

      allAuthors[articleAuthor]=1;
    }else {
      allAuthors[articleAuthor]++;
    }

    /* [NEW] find list of authors in right column */

    const authorList = document.querySelector('.authors');
    const authorsParams = calculateAuthorsParams(allAuthors);

    /* [NEW] create for all link HTML code */

    const allAuthorsData = {authors: [ ]};

    /* [NEW] START LOOP: for each author in allAuthors */

    for (let author in allAuthors){

      /* [NEW] generate code of a link and add it to allAuthorsHTML */

      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
        className: calculateAuthorsClass(allAuthors[author], authorsParams)
      });

      /* [NEW] END LOOP: for each author in allAuthors */
    }

    /* [NEW] add HTML from allAuthorsHTML to authorList */

    authorList.innerHTML = templates.authorCloudLink(allAuthorsData);

    /* insert HTML of all the links into the tags wrapper */

    authorWrapper.insertAdjacentHTML('afterbegin', html);

  }
}
generateAuthors();

const optAuthorLinkSelector =  '.post-author authors a';

function authorClickHandler(event){
  event.preventDefault();
  const clickedElement = this;

  /*get attribute 'href' from clickedElement*/

  const href = clickedElement.getAttribute('href');

  const author = href.replace('#author-', '');

  const activeLinks = document.querySelectorAll('a.active[href^="#author-"]');

  for (let activeAuthorLink of activeLinks){

    activeAuthorLink.classList.remove('active');
  }

  const equalAuthorLinks = document.querySelectorAll('html');

  for (let authorLink of equalAuthorLinks){

    authorLink.classList.add('active');
  }

  generateTitleLinks('[data-author~="' + author + '"]');
}

function addClickListenersToAuthors(){

  /* find links to authors*/

  const links = document.querySelectorAll(optAuthorsListSelector);

  /*start LOOP for all links*/

  for(let link of links){
    link.addEventListener('click', authorClickHandler);

  /*end LOOP for each link*/
  }
}

addClickListenersToAuthors();
