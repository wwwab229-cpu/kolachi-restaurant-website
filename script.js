(() => {
  const toggle=document.querySelector(".menu-toggle");
  const nav=document.querySelector(".navigation");
  if(toggle&&nav){
    toggle.addEventListener("click",()=>{
      const open=nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded",String(open));
      toggle.setAttribute("aria-label",open?"Close navigation":"Open navigation");
    });
    nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded","false");
      toggle.setAttribute("aria-label","Open navigation");
    }));
  }

  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems=document.querySelectorAll(".reveal");
  const showAll=()=>revealItems.forEach(item=>item.classList.add("visible"));
  if(!("IntersectionObserver" in window)){showAll();}
  else{
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}
    }),{threshold:.12});
    revealItems.forEach(item=>observer.observe(item));
  }

  if(reduce||!window.gsap||!window.ScrollTrigger){return;}
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ignoreMobileResize:true});

  // Hero: pinned, scroll-scrubbed cinematic opening.
  const hero=document.querySelector(".cinematic-hero");
  if(hero){
    const heroImage=hero.querySelector(".hero-image");
    const heroContent=hero.querySelector(".hero-content");
    const heroShade=hero.querySelector(".hero-shade");
    const sceneNumber=hero.querySelector(".scene-number");
    const tl=gsap.timeline({
      scrollTrigger:{trigger:hero,start:"top top",end:"+=165%",pin:true,scrub:1.1,anticipatePin:1,invalidateOnRefresh:true}
    });
    tl.to(heroImage,{scale:1.02,ease:"none",duration:1},0)
      .to(heroContent,{y:-85,opacity:0,ease:"none",duration:.72},.18)
      .to(heroShade,{opacity:.35,ease:"none",duration:1},0)
      .to(sceneNumber,{textContent:"02",snap:{textContent:1},duration:.35},.7);
  }

  // Story image moves at a different rate to create restrained parallax.
  gsap.utils.toArray(".intro-photo img").forEach(img=>{
    gsap.fromTo(img,{yPercent:-7,scale:1.08},{yPercent:7,scale:1.08,ease:"none",
      scrollTrigger:{trigger:img.parentElement,start:"top bottom",end:"bottom top",scrub:true}});
  });

  // Restaurant atmosphere: pinned transition between two visual scenes.
  const experience=document.querySelector(".experience");
  if(experience&&window.innerWidth>800){
    const second=experience.querySelector(".experience-image-alt");
    const copy=experience.querySelector(".experience-content");
    const scene=gsap.timeline({scrollTrigger:{trigger:experience,start:"top top",end:"+=125%",pin:true,scrub:1,anticipatePin:1}});
    scene.to(second,{opacity:1,scale:1.06,ease:"none"},0)
      .fromTo(copy,{y:35},{y:-25,ease:"none"},0);
  }else if(experience){
    gsap.fromTo(experience.querySelector(".experience-image"),{scale:1.12},{scale:1,ease:"none",
      scrollTrigger:{trigger:experience,start:"top bottom",end:"bottom top",scrub:true}});
  }

  // Desktop menu: vertical wheel movement becomes a short horizontal gallery.
  const menu=document.querySelector(".menu-section");
  const track=menu&&menu.querySelector(".menu-grid");
  if(menu&&track&&window.innerWidth>1100){
    const distance=Math.max(0,track.scrollWidth-track.parentElement.clientWidth);
    if(distance>20){
      gsap.to(track,{x:-distance,ease:"none",scrollTrigger:{trigger:menu,start:"top top",end:()=>"+="+(distance*1.25),pin:true,scrub:1,invalidateOnRefresh:true}});
    }
  }

  // Gentle depth shift across the closing visual.
  gsap.utils.toArray(".gallery-strip img").forEach((img,i)=>{
    gsap.fromTo(img,{y:i%2?22:0},{y:i%2?-22:0,ease:"none",
      scrollTrigger:{trigger:img.parentElement,start:"top bottom",end:"bottom top",scrub:true}});
  });
  window.addEventListener("load",()=>ScrollTrigger.refresh(),{once:true});
})();