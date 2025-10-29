// بسيط: يحمل المنتجات من products.json ويتيح عربة مشتريات محلية (localStorage)
const storeName = document.getElementById('store-name');
document.getElementById('year').textContent = new Date().getFullYear();

let products = [];
let cart = JSON.parse(localStorage.getItem('cart')||'[]');

function updateCartUI(){
  document.getElementById('cart-count').textContent = cart.reduce((s,i)=>s+i.quantity,0);
  const list = document.getElementById('cart-items');
  list.innerHTML = '';
  let total = 0;
  cart.forEach(item=>{
    const li = document.createElement('li');
    li.textContent = `${item.title} - ${item.quantity} × ${item.price} ر.س`;
    list.appendChild(li);
    total += item.quantity * item.price;
  });
  document.getElementById('cart-total').textContent = total.toFixed(2);
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  const existing = cart.find(x=>x.id===id);
  if(existing) existing.quantity++;
  else cart.push({id:p.id,title:p.title,price:p.price,quantity:1});
  updateCartUI();
  alert(p.title + " أضيف للسلة");
}

function renderProducts(){
  const container = document.getElementById('products');
  container.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.image||'https://via.placeholder.com/400x300?text=صورة'}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="price">${p.price.toFixed(2)} ر.س</div>
      <button data-id="${p.id}">أضف للسلة</button>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('button[data-id]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      addToCart(parseInt(e.currentTarget.getAttribute('data-id')));
    });
  });
}

async function loadProducts(){
  try{
    const resp = await fetch('products.json');
    products = await resp.json();
    renderProducts();
    updateCartUI();
  }catch(err){
    console.error(err);
    document.getElementById('products').textContent = 'خطأ في تحميل المنتجات';
  }
}

document.getElementById('cart-btn').addEventListener('click', ()=>{
  const panel = document.getElementById('cart');
  panel.classList.toggle('hidden');
});
document.getElementById('close-cart').addEventListener('click', ()=>document.getElementById('cart').classList.add('hidden'));
document.getElementById('checkout-btn').addEventListener('click', ()=>{
  if(cart.length===0){ alert('السلة فارغة'); return; }
  // محاكاة الدفع - في تطبيق حقيقي اربط بوابة دفع
  alert('تم محاكاة الدفع. تفاصيل الطلب سترسل إلى بريدك (محاكاة).');
  cart = [];
  updateCartUI();
  document.getElementById('cart').classList.add('hidden');
});

loadProducts();
