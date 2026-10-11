import { CATEGORIES } from '../data/mock';
import { TopBar } from '../components/UI';
import { Link } from '../store/router';

export default function Categories() {
  return (
    <div className="page">
      <TopBar title="सामानका वर्गहरू" back />
      <div className="cat-grid">
        {CATEGORIES.map((c) => (
          <Link key={c.id} to={`/?cat=${c.id}`} className="cat-cell"><span className="cat-icon">{c.icon}</span>{c.name}</Link>
        ))}
      </div>
    </div>
  );
}
