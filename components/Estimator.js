"use client";
import { useEffect } from "react";
import "./Estimator.css";

export default function Estimator() {
  useEffect(() => {
    /* ==================== RATE CARD — EDIT HERE ====================
       sqft models: rate is ₹ per sq ft.   unit model: ₹ per item.
       YOURS = your published number.  EDIT = my placeholder, inside
       published Hyderabad 2026 bands. Replace before publishing.
       Delete any category you do not sell — the UI rebuilds itself.
    ================================================================ */
    var CATS = {
      apartment: {
        label:'APARTMENT', model:'sqft', lab:'CONFIGURATION',
        opts:[['2 BHK',1250],['3 BHK',1750],['4 BHK',2450]],
        slider:[700,4000,25], def:1750,
        rate:{t:1650,p:2450},                       // t = YOURS, p = EDIT
        inc:['Modular kitchen','Wardrobes','TV + crockery unit','False ceiling','Painting','Electrical + lighting'],
        exc:['Civil work','Appliances','Loose furniture','GST']
      },
      villa: {
        label:'VILLA', model:'sqft', lab:'CONFIGURATION',
        opts:[['3 BHK',3000],['4 BHK',4200],['5 BHK',5500]],
        slider:[2000,9000,50], def:4200,
        rate:{t:1850,p:2850},                       // EDIT
        inc:['Modular kitchen','Wardrobes','Living + dining units','Staircase + foyer','False ceiling','Painting','Electrical + lighting'],
        exc:['Civil work','Landscaping','Appliances','Loose furniture','GST']
      },
      modular: {
        label:'MODULARS ONLY', model:'unit', lab:'KITCHEN + WARDROBES',
        opts:[['L-shape','L'],['U-shape','U'],['Parallel','P'],['No kitchen','N']],
        kitchen:{ L:{t:200000,p:320000}, U:{t:260000,p:400000},
                  P:{t:230000,p:360000}, N:{t:0,p:0} },   // EDIT
        wardrobe:{t:95000,p:160000},                      // EDIT — per wardrobe
        def:'L', wardrobes:3, maxW:8,
        inc:['BWP ply carcass','Soft-close hardware','Factory finished','Site measurement','Installation'],
        exc:['Civil work','Electrical points','Painting','Appliances','GST']
      },
      commercial: {
        label:'COMMERCIAL', model:'sqft', lab:'SPACE TYPE',
        opts:[['Office',2000],['Retail',1500],['Clinic',1200],['Cafe',1400]],
        slider:[400,12000,50], def:2000,
        rate:{t:1600,p:2600},                       // EDIT
        inc:['Workstations + cabins','Reception','Storage units','False ceiling','Painting','Electrical + data'],
        exc:['Civil work','HVAC','IT hardware','Fire + statutory','GST']
      },
      showflat: {
        label:'SHOW FLAT', model:'sqft', lab:'CONFIGURATION',
        opts:[['2 BHK',1250],['3 BHK',1750],['4 BHK',2450]],
        slider:[800,3500,25], def:1750,
        rate:{t:2200,p:3200},                       // EDIT — delete this category if not offered
        inc:['Full interiors','Styling + props','Artwork + soft furnishing','Lighting design','Shoot-ready handover'],
        exc:['Civil work','Appliances','Signage','GST']
      }
    };
    /* ============================================================== */

    var key='apartment', area=CATS.apartment.def, sub=null, wards=3;
    var $=function(i){return document.getElementById(i)};
    var comma=function(n){return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',')};
    var L=function(n){return '\u20B9'+(n/100000).toFixed(1)+' L'};
    var tag=function(t,c){return '<span class="fx-tag'+(c||'')+'">'+t+'</span>'};

    function totals(){
      var c=CATS[key];
      if(c.model==='sqft') return {t:area*c.rate.t, p:area*c.rate.p};
      var k=c.kitchen[sub];
      return {t:k.t+wards*c.wardrobe.t, p:k.p+wards*c.wardrobe.p};
    }

    function buildCats(){
      $('fx-cats').innerHTML = Object.keys(CATS).map(function(k){
        return '<button class="fx-cat" type="button" role="radio" data-k="'+k+'" aria-checked="'+
          (k===key)+'">'+CATS[k].label+'</button>';
      }).join('');
      [].slice.call($('fx-cats').children).forEach(function(b){
        b.addEventListener('click',function(){ key=b.dataset.k; reset(); });
      });
    }

    function reset(){
      var c=CATS[key];
      if(c.model==='sqft'){ area=c.def; sub=null; } else { sub=c.def; wards=c.wardrobes; }
      buildCats(); buildControl(); render();
    }

    function buildControl(){
      var c=CATS[key], h='<div class="fx-chips" role="radiogroup" aria-label="'+c.lab+'">';
      c.opts.forEach(function(o){
        var on = c.model==='sqft' ? (o[1]===area) : (o[1]===sub);
        h+='<button class="fx-chip" type="button" role="radio" data-v="'+o[1]+'" aria-checked="'+on+'">'+o[0]+'</button>';
      });
      h+='</div>';

      if(c.model==='sqft'){
        h+='<input class="fx-slider" id="fx-slider" type="range" min="'+c.slider[0]+'" max="'+c.slider[1]+
           '" step="'+c.slider[2]+'" value="'+area+'" aria-label="Size in square feet">'+
           '<div class="fx-scale"><span>'+comma(c.slider[0])+'</span><span>'+comma(c.slider[1])+' SQ FT</span></div>';
      } else {
        h+='<div class="fx-step"><button type="button" id="fx-minus" aria-label="Fewer wardrobes">&minus;</button>'+
           '<span id="fx-w">'+wards+'</span>'+
           '<button type="button" id="fx-plus" aria-label="More wardrobes">+</button>'+
           '<span class="fx-lab" style="border:0;margin-left:14px">WARDROBES</span></div>';
      }
      $('fx-control').innerHTML=h;

      [].slice.call($('fx-control').querySelectorAll('.fx-chip')).forEach(function(b){
        b.addEventListener('click',function(){
          if(c.model==='sqft'){ area=parseInt(b.dataset.v,10); if($('fx-slider')) $('fx-slider').value=area; }
          else { sub=b.dataset.v; }
          [].slice.call($('fx-control').querySelectorAll('.fx-chip')).forEach(function(e){
            e.setAttribute('aria-checked', e===b ? 'true':'false'); });
          render();
        });
      });

      if($('fx-slider')) $('fx-slider').addEventListener('input',function(){
        area=parseInt(this.value,10);
        [].slice.call($('fx-control').querySelectorAll('.fx-chip')).forEach(function(e){
          e.setAttribute('aria-checked', parseInt(e.dataset.v,10)===area ? 'true':'false'); });
        render();
      });
      if($('fx-plus')) $('fx-plus').addEventListener('click',function(){
        wards=Math.min(CATS[key].maxW,wards+1); $('fx-w').textContent=wards; render(); });
      if($('fx-minus')) $('fx-minus').addEventListener('click',function(){
        wards=Math.max(0,wards-1); $('fx-w').textContent=wards; render(); });
    }

    function render(){
      var c=CATS[key], t=totals();
      $('fx-lab').textContent=c.lab;

      if(c.model==='sqft'){
        $('fx-val').textContent=comma(area)+' sq ft';
        $('fx-rate-t').textContent='\u20B9'+comma(c.rate.t)+' / SQ FT';
        $('fx-rate-p').textContent='\u20B9'+comma(c.rate.p)+' / SQ FT';
      } else {
        var kn={L:'L-shape kitchen',U:'U-shape kitchen',P:'Parallel kitchen',N:''}[sub];
        $('fx-val').textContent=(kn? kn+' \u00B7 ':'')+wards+' wardrobe'+(wards===1?'':'s');
        $('fx-rate-t').textContent='PER UNIT';
        $('fx-rate-p').textContent='PER UNIT';
      }

      $('fx-fig-t').textContent=L(t.t);
      $('fx-fig-p').textContent=L(t.p);
      $('fx-in').innerHTML=c.inc.map(function(i){return tag(i)}).join('');
    }

    reset();

    // Numbers stay blurred here — only unblurred once the lead is actually
    // captured (see the 'fx-quote-submitted' listener below), not just on
    // opening the modal.
    document.addEventListener('fx-quote-submitted', function () {
      $('fx-price-card').classList.add('fx-revealed');
    });

    $('fx-cta-btn').addEventListener('click', function(e) {
      e.preventDefault();
      var c = CATS[key];
      var t = totals();
      var sizeStr = c.model === 'sqft' 
        ? comma(area) + ' sq ft' 
        : (sub ? {L:'L-shape',U:'U-shape',P:'Parallel',N:'No kitchen'}[sub] : '') + ' \u00B7 ' + wards + ' wardrobe' + (wards === 1 ? '' : 's');
      var typeStr = c.label;
      var rangeStr = L(t.t) + ' \u2013 ' + L(t.p);
      
      if (window.FXQuote) {
        window.FXQuote.open({
          type: typeStr,
          size: sizeStr,
          spec: 'Titanium / Platinum',
          range: rangeStr
        });
      }
    });
  }, []);

  return (
    <section className="fx-quote wrap" id="estimate">
      <div className="fx-wrap">
        <div className="fx-grid" style={{ marginTop: 0 }}>
          <div>
            <div className="fx-top"><span className="fx-eyebrow">YOUR QUOTE</span><span className="fx-rule"></span></div>
            <h2 className="fx-h"><span>Your number, before</span><span>anyone calls you.</span></h2>
            <p className="fx-sub">PICK THE JOB. MOVE THE SLIDER.</p>

            <div className="fx-cats" id="fx-cats" role="radiogroup" aria-label="Project type"></div>

            <div className="fx-head" style={{ marginTop: "clamp(20px,2.4vw,32px)" }}>
              <span className="fx-lab" id="fx-lab">CONFIGURATION</span>
              <span className="fx-val" id="fx-val">&mdash;</span>
            </div>
            <div id="fx-control"></div>

            <div className="fx-tags">
              <span className="fx-tag-lab">INCLUDED</span>
              <div className="fx-tag-row" id="fx-in"></div>
            </div>
          </div>

          <div className="fx-card" id="fx-price-card">
            <span className="fx-card-lab">INDICATIVE &mdash; EXACT AFTER MEASUREMENT</span>
            <div className="fx-two">
              <div className="fx-opt">
                <span className="fx-opt-n">TITANIUM<span className="fx-opt-s">INDIAN BRANDS</span></span>
                <p className="fx-fig" id="fx-fig-t">&mdash;</p>
                <p className="fx-rate" id="fx-rate-t"></p>
                <ul className="fx-spec">
                  <li>BWP ply carcass</li><li>Merino laminate</li>
                  <li>Hettich India hardware</li><li>Quartz counter</li>
                </ul>
              </div>
              <div className="fx-opt fx-opt--hi">
                <span className="fx-opt-n">PLATINUM<span className="fx-opt-s">IMPORTED BRANDS</span></span>
                <p className="fx-fig" id="fx-fig-p">&mdash;</p>
                <p className="fx-rate" id="fx-rate-p"></p>
                <ul className="fx-spec">
                  <li>BWP ply carcass</li><li>Acrylic / PU shutters</li>
                  <li>Imported soft-close hardware</li><li>Upgraded counters</li>
                </ul>
              </div>
            </div>

            <div className="fx-trust">
              <span>10-YEAR WARRANTY</span><span>FIXED AFTER SIGN-OFF</span><span>LINE-BY-LINE QUOTE</span>
            </div>

            <button className="fx-cta" id="fx-cta-btn" type="button">Get the exact cost in 48 hours</button>
            <p className="fx-fine">Priced on the sq ft in your agreement. Exact figure after measurement &mdash; and it does not move after that.</p>
          </div>

        </div>
      </div>
    </section>
  );
}
