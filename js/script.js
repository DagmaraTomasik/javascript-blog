'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
}

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');

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
  console.log(artcileSelector);

  /* find the correct article using the selector (value of '' attribute) */

  const targetArticle = document.querySelector(artcileSelector);

  /* add class 'active' to the correct article */

  targetArticle.classList.add('active');
}

/* */

function generateTitleLinks(customSelector = '') {

  /* remove contents of titleList */

  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  /* for each article */

  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html = '';

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
const optArticleTagsElementSelector = '.post-tags .list li';
const optTagsListSelector = '.tags .list';
const optCloudClassCount = '5';
const optCloudClassPrefix = 'tag-size-';

function calculateTagsParams(tags){

  const params = {max: '0', min: '999999'};
  console.log(params);

  for(let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times ');

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

    const tagLinks = article.querySelector(optArticleTagsSelector);

    /* make html variable with empty string */

    let html = ' ';

    /* get tags from data-tags attribute */

    const articleTags = article.getAttribute('data-tags');
    console.log(articleTags);

    /* split tags into array */

    const articleTagsArray = articleTags.split(' ');
    console.log(articleTagsArray);

    /* START LOOP: for each tag */

    for (let tag of articleTagsArray){

      /* generate HTML of the link */

      const linkHTMLData = {id: tag, title: tag};
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
    console.log('tagsParams:', tagsParams);

    /* [NEW] create variable for all links HTML code */

    const allTagsData = {tags: []};

    /* [NEW] START LOOP: for each tag in allTags */

    for(let tag in allTags){

      const tagLinkHTML = '<li><a class="'+ optCloudClassPrefix + calculateTagClass(allTags[tag], tagsParams) +'" href ="#tag-'+ tag +'">' + tag + '</a>(' + allTags[tag] + ')</li> ';
      console.log('tagLinkHTML:', tagLinkHTML);

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
    console.log(allTagsData);

    /* insert HTML of all the links into the tags wrapper */

    tagLinks.insertAdjacentHTML('beforeend', html);

    /* END LOOP: for every article: */

  }
}

generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */

  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */

  const clickedElement = this;
  console.log('Tag was clicked', clickedElement);

  /* make a new constant "href" and read the attribute "href" of the clicked element */

  const link = clickedElement.querySelector('a[href^="#tag-"]');
  const href = link.getAttribute(href);

  /* make a new constant "tag" and extract tag from the "href" constant */

  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */

  const activeTagLinks = document.querySelectorAll('a.active');

  /* START LOOP: for each active tag link */

  for (let activeTagLink of activeTagLinks){

    /* remove class active */

    activeTagLink.classList.remove('active');

    /* END LOOP: for each active tag link */

  }

  /* find all tag links with "href" attribute equal to the "href" constant */

  const hrefLinks = document.querySelectorAll('html');
  console.log(hrefLinks);

  /* START LOOP: for each found tag link */

  for (let hrefLink of hrefLinks){

    /* add class active */

    hrefLink.classList.add('active');

    /* END LOOP: for each found tag link */

  }

  /* execute function "generateTitleLinks" with article selector as argument */

  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */

  const links = document.querySelectorAll(optArticleTagsElementSelector);

  /* START LOOP: for each link */

  for (let link of links){

    /* add tagClickHandler as event listener for that link */

    link.addEventListener('click', tagClickHandler);

  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

const optArticleAuthorSelector = '.post-author';
const optAuthorsListSelector = '.list .authors';
const optAuthorCloudClassCount = '1';
const optAuthorCloudClassPrefix = 'author-size-';

function calculateAuthorsParams(authors){
  const params = {max: '0', min: '999999'};
  console.log(params);

  for(let author in authors){
    console.log(author + ' is used ' + authors[author] + ' times ');

    if(authors[author] > params.max){
      params.max = authors[author];
    }
    else if (authors[author] < params.min) {
      params.min = authors[author];
    }
  }
  return params;
}

function calculateAuthorClass (count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const porcentage = normalizedCount/normalizedMax;
  const classNumber = Math.floor(porcentage * (optAuthorCloudClassCount - 1) + 1);

  return classNumber;
}

function generateAutors(){

  /* [NEW] create a new variable allAuthors with an empty object */

  let allAuthors = {};

  /* find all authors */

  const authors = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article */

  for (let author of authors){
  /* find autor wrapper*/

    const authorLinks = author.querySelector(optArticleAuthorSelector);

    /* make html variable with empty string */

    let html = ' ';

    /* get autor from data-authot attribute */

    const dataAuthor = author.getAttribute('data-author');
    console.log(dataAuthor);

    /* generate HTML of the link */

    const linkHTMLData = {id:dataAuthor, title: dataAuthor};
    const linkHTML = templates.authorLink(linkHTMLData);

    /* add generated code to html variable */

    html = html + linkHTML;

    /* [NEW] check if this link is NOT already in allAuthors */

    if(!allAuthors.hasOwnProperty(author)){

      /* [NEW] add author to allAuthors object */

      allAuthors[dataAuthor] = dataAuthor;
      }

    /* [NEW] find list of authors in right column */

    const authorList = document.querySelector('.authors');

    const authorsParams = calculateAuthorsParams(allAuthors);
    console.log(authorsParams);

    /* [NEW] create for all link HTML code */

    const allAuthorsData = {autors: []};

    /* [NEW] START LOOP: for each author in allAuthors */

    for (let author in allAuthors){

      const authorLinkHTML = '<li><a class="'+ optAuthorCloudClassPrefix + calculateAuthorClass(allAuthors[author], authorsParams) +'" href ="#autor-'+ author +'">' + author + '</a></li> ';
      console.log('authorLinkHTML:', authorLinkHTML);

      /* [NEW] generate code of a link and add it to allAuthorsHTML */

      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
        className: calculateAuthorClass(allAuthors[author], authorsParams)
      });

      /* [NEW] END LOOP: for each author in allAuthors */
    }

    /* [NEW] add HTML from allAuthorsHTML to authorList */

    authorList.innerHTML = templates.authorCloudLink(allAuthorsData);

    /* insert HTML of all the links into the tags wrapper */

    authorLinks.insertAdjacentHTML('afterbegin', html);

  }
}
generateAutors();

const optAuthorLinkSelector =  '.post-author a';

function authorClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Author was clicked', clickedElement);

  /*get attribute 'href' from clickedElement*/

  const href = clickedElement.getAttribute('href');

  generateTitleLinks('[data-author ="' + href + '"]');
}


function addClickListenersToAuthors(){

  /* find links to authors*/

  const authors = document.querySelectorAll(optAuthorLinkSelector);

  /*start LOOP for all links*/

  for(let author of authors){
    author.addEventListener('click', authorClickHandler);

  /*end LOOP for each link*/
  }
}

addClickListenersToAuthors();
