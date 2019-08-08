const optArticleTagsSelector = '.post-tags .list';
const optArticleTagsElementSelector = '.posts .list li';
const optTagsListSelector = '.tags.list';

/* [NEW] create a new variable allTags with an empty object */

let allTags = {};

/* find all articles */

const articles = document.querySelectorAll(optArticleSelector);

/* START LOOP: for every article: */

for (let article of articles){

  /* find tags wrapper */

  const tagsWrapper = article.querySelector(optArticleTagsSelector);

  /* make html variable with empty string */

  let html = '';

  /* get tags from data-tags attribute */

  const articleTags = article.getAttribute('data-tags');

  /* split tags into array */

  const articleTagsArray = articleTags.split(' ');

  /* START LOOP: for each tag */

  for (let tag of articleTagsArray){

    /* generate HTML of the link */

    const linkHTMLData = {tag: tag};
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

  console.log(allTagsData);

  //const tags = tagList.querySelectorAll('li');

  //for(let tag of tags) {
    //tag.addEventListener("click", function() { console.log(' TEST ') })
  //}

  /* insert HTML of all the links into the tags wrapper */

  tagsWrapper.insertAdjacentHTML('beforeend', html);

  /* END LOOP: for every article: */

  console.log(allTags);

}

console.log("Zakonczylem generowanie tagów");

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
