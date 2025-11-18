// =========================
// DATA PRODUK
// =========================
const products = [
  {id:1, name:'Rainbow Cake', price:75000, desc:'Kue pelangi manis dengan krim warna-warni', img:'img/rainbow.jpg'},
  {id:2, name:'Chocolate Fudge', price:65000, desc:'Cokelat lembut untuk pencinta cokelat', img:'img/coklat.jpg'},
  {id:3, name:'Strawberry Short', price:60000, desc:'Lapisan stroberi dan krim segar', img:'img/strawbery.jpg'},
  {id:4, name:'Cupcakes Mix', price:50000, desc:'Aneka cupcakes lembut dan manis', img:'img/cupcakes.jpg'},
  {id:5, name:'Unicorn Cake', price:95000, desc:'Kue unicorn cantik untuk pesta', img:'img/unicorn.jpg'},
  {id:6, name:'Pandan Delight', price:55000, desc:'Aroma pandan khas dan lembut', img:'img/pandan.jpg'},
];



const cart = {};


// =========================
// HELPER
// =========================
function formatIDR(n) {
  return 'Rp ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function cartItems() {
  return Object.keys(cart).map(k => ({
    product: products.find(p => p.id == k),
    qty: cart[k]
  }));
}


// =========================
// RENDER PRODUK
// =========================
// =========================
// RENDER PRODUK (PAKAI IMG)
// =========================
const productsEl = document.getElementById('products');

function renderProducts() {
  productsEl.innerHTML = '';

  products.forEach(p => {
    const el = document.createElement('div');
    el.className = 'card';

    el.innerHTML = `
      <img src="${p.img}" class="cake-img" alt="${p.name}">
      
      <div class="cake-title">${p.name}</div>
      <div style="color:var(--muted);font-size:13px">${p.desc}</div>

      <div class="meta" style="margin-top:10px">
        <div class="price">${formatIDR(p.price)}</div>
        <div><button class="btn" data-id="${p.id}">Tambah</button></div>
      </div>
    `;

    productsEl.appendChild(el);
  });

  // button tambah
  document.querySelectorAll('[data-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-id'));
      addToCart(id);
    });
  });
}



// =========================
// CART LOGIC
// =========================
function addToCart(id) {
  if (!cart[id]) cart[id] = 0;
  cart[id]++;
  updateCartUI();
  sparkles();
}

function removeFromCart(id) {
  delete cart[id];
  updateCartUI();
}

function changeQty(id, qty) {
  if (qty <= 0) removeFromCart(id);
  else cart[id] = qty;

  updateCartUI();
}


// =========================
// UPDATE UI KERANJANG
// =========================
function updateCartUI() {
  const count = cartItems().reduce((sum, it) => sum + it.qty, 0);
  const countEl = document.getElementById('count');
  if (countEl) countEl.textContent = count;

  const mini = document.getElementById('miniCart');
  const list = document.getElementById('cartList');
  const totalEl = document.getElementById('total');

  // Mini cart
  if (mini) {
    if (count === 0) {
      mini.innerHTML = `<div style="color:var(--muted)">Belum ada item — ayo tambah kue!</div>`;
    } else {
      mini.innerHTML = cartItems()
        .map(it => `
          <div style="display:flex;justify-content:space-between;margin:6px 0">
            <div>${it.product.name} x${it.qty}</div>
            <div style="font-weight:800">${formatIDR(it.product.price * it.qty)}</div>
          </div>
        `)
        .join('');
    }
  }

  // Modal cart list
  if (list) {
    if (count === 0) {
      list.innerHTML = '<div style="color:var(--muted)">Keranjang kosong</div>';
    } else {
      list.innerHTML = cartItems()
        .map(it => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px dashed #eee">
            
            <div style="flex:1">
              <div style="font-weight:700">${it.product.name}</div>
              <div style="font-size:13px;color:var(--muted)">${formatIDR(it.product.price)}</div>
            </div>

            <div style="display:flex;gap:6px;align-items:center">
              <button style="padding:6px 8px;border-radius:8px;background:#f2f2f2;border:none;cursor:pointer"
                onclick="changeQty(${it.product.id}, ${it.qty - 1})">-</button>

              <div>${it.qty}</div>

              <button style="padding:6px 8px;border-radius:8px;background:#f2f2f2;border:none;cursor:pointer"
                onclick="changeQty(${it.product.id}, ${it.qty + 1})">+</button>

              <div style="width:10px"></div>

              <div style="font-weight:800">${formatIDR(it.product.price * it.qty)}</div>
            </div>

          </div>
        `)
        .join('');
    }
  }

  // Hitung total
  const total = cartItems().reduce((sum, it) => sum + it.product.price * it.qty, 0);
  if (totalEl) totalEl.textContent = formatIDR(total);
}


// =========================
// MODAL + BUTTON ACTIONS
// =========================
const modal = document.getElementById('modal');
const cartBtn = document.getElementById('cartBtn');

if (cartBtn) {
  cartBtn.addEventListener('click', () => {
    if (modal) modal.classList.add('visible');
  });
}

if (modal) {
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('visible');
  });
}

const checkoutBtn = document.getElementById('checkout');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (Object.keys(cart).length === 0) {
      alert('Keranjang kosong — tambahkan kue dulu!');
      return;
    }

    alert('Terima kasih! Pesananmu akan diprosesya.');
    Object.keys(cart).forEach(k => delete cart[k]);

    updateCartUI();
    if (modal) modal.classList.remove('visible');
  });
}

const shopNowBtn = document.getElementById('shopNow');
if (shopNowBtn) {
  shopNowBtn.addEventListener('click', () => {
    const el = document.getElementById('products');
    if (el) window.scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' });
  });
}

const openAllBtn = document.getElementById('openAll');
if (openAllBtn) {
  openAllBtn.addEventListener('click', () => {
    const el = document.getElementById('products');
    if (el) el.querySelector('.card')?.scrollIntoView({ behavior: 'smooth' });
  });
}

const surpriseBtn = document.getElementById('surprise');
if (surpriseBtn) {
  surpriseBtn.addEventListener('click', () => {
    const r = products[Math.floor(Math.random() * products.length)];
    addToCart(r.id);
    alert(`Kejutan! "${r.name}" ditambahkan ke keranjang.`);
  });
}


// =========================
// SPARKLE EFFECT
// =========================
function sparkles() {
  const s = document.createElement('div');
  s.className = 'sprinkle';

  s.style.left        = (Math.random() * 70 + 20) + '%';
  s.style.top         = (Math.random() * 40 + 20) + '%';
  s.style.width       = '12px';
  s.style.height      = '12px';
  s.style.borderRadius = '6px';
  s.style.position    = 'fixed';
  s.style.zIndex      = 9999;
  s.style.background  =
    'linear-gradient(90deg, rgba(255,122,162,0.9), rgba(255,210,127,0.9))';

  document.body.appendChild(s);

  setTimeout(() => {
    s.style.transform = 'translateY(-40px) scale(.2)';
    s.style.opacity   = '0';
    s.style.transition = 'all .8s ease';
  }, 20);

  setTimeout(() => s.remove(), 900);
}


// =========================
// INIT
// =========================
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartUI();
  window.changeQty = changeQty;
});
