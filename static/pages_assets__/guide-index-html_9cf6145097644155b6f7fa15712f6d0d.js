    import reLiftHTML from '//unpkg.com/relift-html';
    const debounce = (callback, time = 250, interval) => (...args) => clearTimeout(interval, interval = setTimeout(callback, time, ...args));

    reLiftHTML({
      el: '#sideMenu',
      data: {
        menu: []
      },
      created() {
        const sections = [];
        const scrollSpies = {};
        for (const s of document.querySelectorAll('#page-guide section')) {
          const h2 = s.querySelector('h2');
          h2.parentElement.setAttribute('data-section', h2.id);
          const slug = this.slugify(h2.innerText);
          h2.setAttribute('id', `${slug}`)
          scrollSpies[slug] = h2.offsetTop;

          /** 
            Fix the anchoring problem with all the MDs
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
          
          sections.push({
            title: h2.innerText,
            url: slug,
            subsections: [...s.querySelectorAll('h3')].map(el => {
              const id = el.getAttribute('id');
              return {
                title: el.innerText, 
                url: `${id}`
              }
            })
          })

        }
        this.data.menu = sections;
        //this.data.scrollSpies = scrollSpies;

        const scrollSpy = debounce(() => {
          const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
          for (const i in scrollSpies) {
            if (scrollSpies[i] <= scrollPosition) {
              const lastActive = this.el.querySelector('ul li.active');
              const active = this.el.querySelector(`[data-section='${i}']`);
              if (lastActive) lastActive.classList.remove('active');
              if (active) active.classList.add('active');
            }
          }
        }, 100);

        const el = document.querySelector('#content-side-affix')
        const top = el.getAttribute('data-affix-top') || 100;
        
        const scroll = () => {
          const scrollTop = window.pageYOffset;
          if (window.matchMedia('(min-width: 640px)').matches) {
            if( scrollTop > 100 ){
              el.style.top=`${top}px`;
              el.style.width=`200px`;
              el.style.position='fixed';
            } else {
              el.style.position='relative';
              el.style.top='0px';
            }
            this.el.querySelector('#content-side-affix').classList.remove('show')
            scrollSpy();
          } else {
            console.log('Small viewport');
          }

          
        };
  
        
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

      },
      slugify: (s) => {
        return s.toLowerCase()
        .replace(/[^\w\s-]/g, '') // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
        .replace(/[\s_-]+/g, '-') // swap any length of whitespace, underscore, hyphen characters with a single -
        .replace(/^-+|-+$/g, '') // remove leading, trailing -
      },
      scrollTo(el){
        history.replaceState(undefined, undefined,`#${el.id}`);
        el.scrollIntoView({behavior: 'smooth'});
        this.el.querySelector('#content-side-affix').classList.remove('show')
      },
      scrollToTop() {
        this.scrollTo(document.querySelector('#guide-header'));
      },
      toggleMenuToggler() {
        this.el.querySelector('#content-side-affix').classList.toggle('show')
      }
    });




    
    

