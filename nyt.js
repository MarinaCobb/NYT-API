var baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
var key = 'vGzkswTRsxAt3iTS5Gk84ImlXVGLkGP6';
var url;
// Grab references to all the DOM elements you'll need to manipulate
var searchTerm = document.querySelector('.search');
var startDate = document.querySelector('.start-date');
var endDate = document.querySelector('.end-date');
var searchForm = document.querySelector('form');
var submitBtn = document.querySelector('.submit');
var nextBtn = document.querySelector('.next');
var previousBtn = document.querySelector('.prev');
var section = document.querySelector('section');
var nav = document.querySelector('nav');
// Hide the "Previous"/"Next" navigation to begin with, as we don't need it immediately
nav.style.display = 'none';
// define the initial page number and status of the navigation being displayed
var pageNumber = 0;
var displayNav = false;
// Event listeners to control the functionality
searchForm.addEventListener('submit', submitSearch);
nextBtn.addEventListener('click', nextPage);
previousBtn.addEventListener('click', previousPage);
function submitSearch(e){
  pageNumber = 0;
  fetchResults(e);
}
function fetchResults(e) {
  // Use preventDefault() to stop the form submitting
  e.preventDefault();
  // Assemble the full URL
  url = baseURL + '?api-key=' + key + '&page=' + pageNumber + '&q=' + searchTerm.value + '&fq=document_type:("article")';
  if(startDate.value !== '') {
    url += '&begin_date=' + startDate.value;
  };
  if(endDate.value !== '') {
    url += '&end_date=' + endDate.value;
  };
  // Use fetch() to make the request to the API
  fetch(url).then(function(result) {
    return result.json();
  }).then(function(json) {
    displayResults(json);
  });
}
function displayResults(json) {
  while (section.firstChild) {
      section.removeChild(section.firstChild);
  }
  var articles = json.response.docs;
  if(articles.length === 10) {
    nav.style.display = 'block';
  } else {
    nav.style.display = 'none';
  }
  if(articles.length === 0) {
    var para = document.createElement('p');
    para.textContent = 'No results returned.'
    section.appendChild(para);
  } else {
    for(var i = 0; i < articles.length; i++) {
      var article = document.createElement('article');
      var heading = document.createElement('h2');
      var link = document.createElement('a');
      var img = document.createElement('img');
      var para1 = document.createElement('p');
      var para2 = document.createElement('p');
      var clearfix = document.createElement('div');
      var current = articles[i];
      console.log(current);
      link.href = current.web_url;
      link.textContent = current.headline.main;
      para1.textContent = current.snippet;
      para2.textContent = 'Keywords: ';
      for(var j = 0; j < current.keywords.length; j++) {
        var span = document.createElement('span');
        span.textContent = current.keywords[j].value + ' ';
        para2.appendChild(span);
      }
      if(current.multimedia.length > 0) {
        img.src = 'http://www.nytimes.com/' + current.multimedia[0].url;
        img.alt = current.headline.main;
      }
      clearfix.setAttribute('class','clearfix');
      article.appendChild(heading);
      heading.appendChild(link);
      article.appendChild(img);
      article.appendChild(para1);
      article.appendChild(para2);
      article.appendChild(clearfix);
      section.appendChild(article);
    }
  }
};
function nextPage(e) {
  pageNumber++;
  fetchResults(e);
};
function previousPage(e) {
  if(pageNumber > 0) {
    pageNumber--;
  } else {
    return;
  }
  fetchResults(e);
};