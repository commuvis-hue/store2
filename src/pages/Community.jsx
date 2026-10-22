import { t } from '../i18n';
import { useState } from 'react';
import { useStore } from '../store/Store';
import { Link, useRouter } from '../store/router';
import { COMMUNITY_TOPICS } from '../data/mock';
import { Img, Fab, Empty, TopBar, Avatar } from '../components/UI';
import { ISearch, IChat, IHeart, ISend, IMore } from '../components/Icons';
import { ago, fileToDataUrl, ne } from '../utils';

export default function Community() {
  const { state, user } = useStore();
  const [topic, setTopic] = useState('सबै');
  const [q, setQ] = useState('');
  const posts = state.posts
    .filter((p) => !state.blocked.includes(p.authorId))
    .filter((p) => topic === 'सबै' || p.topic === topic)
    .filter((p) => !q || (p.title + p.body).includes(q))
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="page">
      <header className="topbar"><h1 className="topbar-title left">{t('छिमेकका कुरा')}</h1></header>
      <div className="pad-x">
        <label className="search-field soft"><ISearch size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('{region} का छिमेकीका कुरा खोज्नुहोस्', { region: t(state.me.region) })} /></label>
      </div>
      <div className="chips">{COMMUNITY_TOPICS.map((x) => <button key={x} className={`chip ${topic === x ? 'is-on' : ''}`} onClick={() => setTopic(x)}>{t(x)}</button>)}</div>
      {posts.length === 0 ? <Empty icon="💬" title={t('अहिलेसम्म कुनै पोस्ट छैन')} desc={t('छिमेकीसँग पहिलो कुरा सुरु गर्नुहोस्।')} /> :
        <div className="posts">{posts.map((p) => {
          const a = user(p.authorId);
          return (
            <Link key={p.id} to={`/community/${p.id}`} className="post">
              <span className="post-topic">{t(p.topic)}</span>
              <div className="post-main">
                <div><h3>{t(p.title)}</h3><p className="post-body">{t(p.body)}</p></div>
                {p.image && <div className="post-img"><Img src={p.image} alt="" seed={p.id} /></div>}
              </div>
              <p className="meta">{a?.nickname} · {t(p.region)} · {ago(p.createdAt)}</p>
              <div className="post-counts"><span><IHeart size={15} /> {t('सहमति')} {ne(p.likes)}</span><span><IChat size={15} /> {t('प्रतिक्रिया')} {ne(p.comments.length)}</span></div>
            </Link>);
        })}</div>}
      <Fab to="/community/write" label={t('लेख्नुहोस्')} />
    </div>
  );
}

export function PostDetail({ id }) {
  const { state, dispatch, user, uid, showToast } = useStore();
  const { navigate } = useRouter();
  const [text, setText] = useState('');
  const p = state.posts.find((x) => x.id === id);
  if (!p) return <div className="page"><TopBar back /><Empty icon="🫥" title={t('यो पोस्ट हटाइएको छ')} /></div>;
  const a = user(p.authorId);
  const liked = state.postLikes.includes(p.id);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch({ type: 'ADD_COMMENT', postId: p.id, comment: { id: uid('cm'), authorId: 'me', text: text.trim(), createdAt: Date.now() } });
    setText('');
  };

  return (
    <div className="page has-actionbar">
      <TopBar back title="" right={p.authorId === 'me' && <button className="icon-btn" aria-label={t('मेटाउनुहोस्')} onClick={() => { if (confirm(t('यो पोस्ट मेटाउने?'))) { dispatch({ type: 'DELETE_POST', id: p.id }); showToast(t('पोस्ट मेटाइयो')); navigate('/community', { replace: true }); } }}><IMore /></button>} />
      <article className="pad">
        <span className="post-topic">{t(p.topic)}</span>
        <Link to={`/users/${a.id}`} className="author"><Avatar user={a} size={36} /><div><strong>{a.nickname}</strong><p className="meta">{t(p.region)} · {ago(p.createdAt)}</p></div></Link>
        <h2 className="detail-title">{t(p.title)}</h2>
        <p className="detail-desc">{t(p.body)}</p>
        {p.image && <div className="post-full-img"><Img src={p.image} alt="" seed={p.id} /></div>}
        <button className={`empathy ${liked ? 'is-on' : ''}`} onClick={() => dispatch({ type: 'TOGGLE_POST_LIKE', id: p.id })} aria-pressed={liked}>
          <IHeart size={18} filled={liked} /> {t('सहमति')} {ne(p.likes)}
        </button>
      </article>
      <section className="pad section">
        <h3 className="section-title">{t('प्रतिक्रिया')} {ne(p.comments.length)}</h3>
        {p.comments.length === 0 && <p className="meta">{t('पहिलो प्रतिक्रिया दिनुहोस्।')}</p>}
        {p.comments.map((c) => { const cu = user(c.authorId); return (
          <div key={c.id} className="comment"><Avatar user={cu} size={30} /><div><strong>{cu.nickname}</strong> <span className="meta">{ago(c.createdAt)}</span><p>{t(c.text)}</p></div></div>); })}
      </section>
      <form className="actionbar composer" onSubmit={submit}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder={t('प्रतिक्रिया लेख्नुहोस्')} aria-label={t('प्रतिक्रिया')} />
        <button className="icon-btn send" disabled={!text.trim()} aria-label={t('पठाउनुहोस्')}><ISend /></button>
      </form>
    </div>
  );
}

export function CommunityWrite() {
  const { state, dispatch, uid, showToast } = useStore();
  const { navigate } = useRouter();
  const [topic, setTopic] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const ok = topic && title.trim() && body.trim();
  return (
    <div className="page has-actionbar">
      <TopBar back title={t('छिमेकमा लेख्नुहोस्')} />
      <div className="pad form">
        <label className="field"><span>{t('विषय')}</span>
          <select className="input" value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="">{t('पोस्टको विषय छान्नुहोस्')}</option>
            {COMMUNITY_TOPICS.slice(1).map((x) => <option key={x} value={x}>{t(x)}</option>)}
          </select></label>
        <label className="field"><span>{t('शीर्षक')}</span><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('शीर्षक लेख्नुहोस्')} /></label>
        <label className="field"><span>{t('विवरण')}</span><textarea className="input" rows={8} value={body} onChange={(e) => setBody(e.target.value)} placeholder={t('{region} का छिमेकीसँग के कुरा गर्न चाहनुहुन्छ?', { region: t(state.me.region) })} /></label>
        <label className="btn ghost">{t('फोटो थप्नुहोस्')}<input type="file" accept="image/*" hidden onChange={async (e) => e.target.files[0] && setImage(await fileToDataUrl(e.target.files[0]))} /></label>
        {image && <div className="post-full-img"><img src={image} alt={t('थपिएको फोटो')} /></div>}
      </div>
      <div className="actionbar"><button className="btn block" disabled={!ok} onClick={() => {
        const id = uid('c');
        dispatch({ type: 'ADD_POST', post: { id, topic, title: title.trim(), body: body.trim(), image, authorId: 'me', region: state.me.region, createdAt: Date.now(), likes: 0, comments: [] } });
        showToast(t('पोस्ट प्रकाशित भयो')); navigate(`/community/${id}`, { replace: true });
      }}>{t('प्रकाशित गर्नुहोस्')}</button></div>
    </div>
  );
}
