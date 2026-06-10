import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { useStore } from '../store';
import { I18N } from '../i18n';
import { listGroups, joinGroup, leaveGroup, createGroup } from '../api';

export function GroupsPage() {
  const { lang, currentUser } = useStore();
  const t = I18N[lang];
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: listGroups,
  });

  const joinMutation = useMutation({
    mutationFn: (normalizedName: string) => joinGroup(normalizedName),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['groups'] }),
  });

  const leaveMutation = useMutation({
    mutationFn: (normalizedName: string) => leaveGroup(normalizedName),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['groups'] }),
  });

  const createMutation = useMutation({
    mutationFn: () => createGroup({ name: newName, description: newDesc }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['groups'] });
      setNewName('');
      setNewDesc('');
      setShowCreate(false);
    },
  });

  return (
    <div className="ot-page">
      <div className="ot-page-head">
        <div>
          <h1 className="ot-page-title">{t.groups}</h1>
        </div>
        {currentUser && (
          <button className="ot-rec-btn" onClick={() => setShowCreate((s) => !s)}>
            <Icon name="plus" size={16} stroke={2.4} />
            <span>{t.createGroup}</span>
          </button>
        )}
      </div>

      {showCreate && (
        <Card
          style={{
            marginBottom: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            padding: 20,
          }}
        >
          <h4 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            {t.createGroup}
          </h4>
          <input
            className="ot-input"
            placeholder={t.groupName}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <textarea
            className="ot-input"
            placeholder={t.groupDesc}
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            rows={2}
            style={{ resize: 'vertical' }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="ot-rec-btn"
              onClick={() => createMutation.mutate()}
              disabled={!newName.trim() || createMutation.isPending}
            >
              {t.createGroup}
            </button>
            <button
              className="ot-iconbtn"
              style={{ width: 'auto', padding: '0 12px', fontSize: 14 }}
              onClick={() => setShowCreate(false)}
            >
              {t.cancel}
            </button>
          </div>
        </Card>
      )}

      {isLoading && (
        <div style={{ color: 'var(--text-faint)', textAlign: 'center', padding: '40px 0' }}>…</div>
      )}

      {!isLoading && (groups?.length ?? 0) === 0 && (
        <Card style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-faint)' }}>
          <Icon name="feed" size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <div>{t.noGroups}</div>
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(groups ?? []).map((g) => (
          <Card key={g.id} style={{ padding: '16px 20px' }}>
            <div className="ot-group-card">
              <div style={{ minWidth: 0 }}>
                <Link
                  to="/feed"
                  search={{ group: g.normalizedName }}
                  className="ot-group-name"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {g.name}
                </Link>
                <div className="ot-group-meta">
                  {g.memberCount} {t.members}
                  {g.description ? ` · ${g.description}` : ''}
                </div>
              </div>
              {currentUser &&
                (g.isMember ? (
                  <button
                    className="ot-iconbtn"
                    style={{
                      width: 'auto',
                      padding: '0 14px',
                      fontSize: 13,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                    onClick={() => leaveMutation.mutate(g.normalizedName)}
                    disabled={leaveMutation.isPending}
                  >
                    {t.leaveGroup}
                  </button>
                ) : (
                  <button
                    className="ot-rec-btn"
                    style={{ flexShrink: 0 }}
                    onClick={() => joinMutation.mutate(g.normalizedName)}
                    disabled={joinMutation.isPending}
                  >
                    {t.joinGroup}
                  </button>
                ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
