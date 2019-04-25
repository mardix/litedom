    const el = document.querySelector('#content-side-affix')
    if (el) {
      const scroll = () => {
        const scrollTop = window.pageYOffset;
        if( scrollTop > 100 ){
          el.style.top=`${top}px`;
          el.style.position='fixed';
        } else {
          el.style.position='relative';
          el.style.top='0px';
        }
      };

      const top = el.getAttribute('data-affix-top') || 100;
      [...el.querySelectorAll('[data-affix-link]')].map(e => {
        e.addEventListener('click', (ev) => {
          ev.preventDefault();
          document.querySelector(e.getAttribute('data-affix-link')).scrollIntoView({behavior: 'smooth'});
          setTimeout(() => {
            scroll();
          }, 300)
        })
      })
      window.onscroll = scroll;
    }

    const sections = [];
    for (const s in document.querySelectorAll('.guides section')) {
      const subsections = [];
      const h2 = s.querySelector('h2');
      sections.push({
        title: h2.innerText
      })
    }
    console.log(sections)
    

