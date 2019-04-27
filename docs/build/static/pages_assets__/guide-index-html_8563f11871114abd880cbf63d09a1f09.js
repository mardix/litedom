    import reLiftHTML from '//unpkg.com/relift-html';
  
    reLiftHTML({
      el: '#sideMenu',
      data: {
        menu: []
      },
      mounted() {

        const sections = [];
        for (const s of document.querySelectorAll('.guides section')) {
          const subsections = [];
          const h2 = s.querySelector('h2');
          const slug = this.slugify(h2.innerText);

          h2.setAttribute('id', `${slug}`)
          sections.push({
            title: h2.innerText,
            url: slug
          })

          /** Fix the anchoring problem with all the MDs
            It will remap href and if;
          **/
          s.querySelectorAll('.toc ul li a').forEach(el => {
            const href = el.getAttribute('href').replace('#', '');
            if (slug !== href) {
              const id = `${slug}__${href}`;
              el.setAttribute('href', `#${id}`);
              el.addEventListener('click', e => {
                e.preventDefault();
                this.scrollTo(document.querySelector(`#${id}`));
              })
            }
          })
          s.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => {
            const id = el.getAttribute('id');
            if (id && id !== slug) {
              el.setAttribute('id', `${slug}__${id}`)
            }
          })




        }
        this.data.menu = sections;

        const el = document.querySelector('#content-side-affix')
        if (el) {
          const scroll = () => {
            const scrollTop = window.pageYOffset;
            if( scrollTop > 100 ){
              el.style.top=`${top}px`;
              el.style.width=`200px`;
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
              this.scrollTo(document.querySelector(e.getAttribute('data-affix-link')));
              setTimeout(() => {
                scroll();
              }, 300)
            })
          })
          window.onscroll = scroll;
        }
      },
      slugify: (s) => s.toLowerCase()
      .replace(/[^\w\s-]/g, '') // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
      .replace(/[\s_-]+/g, '-') // swap any length of whitespace, underscore, hyphen characters with a single -
      .replace(/^-+|-+$/g, ''), // remove leading, trailing -
      scrollTo: (el) => {
        const id = el.id;
        console.log('ID', id)
        el.scrollIntoView({behavior: 'smooth'})
      }
    });




    
    

