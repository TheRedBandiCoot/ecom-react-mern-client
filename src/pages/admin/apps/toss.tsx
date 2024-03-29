import { useState } from 'react';
import tail from '../../../assets/images/Tail.png';
import head from '../../../assets/images/head.png';
import AdminSidebar from '../../../components/admin/AdminSidebar';

const Toss = () => {
  const [angle, setAngle] = useState<number>(0);

  const flipCoin = () => {
    if (Math.random() > 0.5) setAngle(prev => prev + 180);
    else setAngle(prev => prev + 360);
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard-app-container">
        <h1>Toss</h1>
        <section>
          <article
            className="tosscoin"
            onClick={flipCoin}
            style={{
              transform: `rotateY(${angle}deg)`
            }}
          >
            <div>
              <img src={head} style={{ width: '50%' }} alt="Head" />
            </div>
            <div>
              <img src={tail} style={{ width: '50%' }} alt="Tail" />
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};

export default Toss;
