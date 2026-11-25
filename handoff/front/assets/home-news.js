// Homepage newsletter signup. The form is not connected to a mailing service yet,
// so it keeps the address in the browser and says so, rather than appearing to subscribe anyone.
const newsForm = document.querySelector('.hn-form');
if (newsForm) {
  newsForm.addEventListener('submit', event => {
    event.preventDefault();
    newsForm.querySelector('.hn-status').textContent = 'Preview only. Your email isn’t sent or saved.';
  });
}
