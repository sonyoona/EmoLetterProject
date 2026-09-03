const Field = ({ label, value, align = 'left' }) => (
  <div className={align === 'right' ? 'text-right' : ''}>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-xl font-semibold text-gray-800">{value}</p>
  </div>
);

const ProfileSummary = ({ user }) => (
  <div className="flex items-center justify-between flex-wrap gap-4">
    <Field label="아이디" value={user?.userId || '-'} />
    <Field label="이메일" value={user?.email || '-'} />
    <Field label="닉네임" value={user?.nickname || '닉네임 미등록'} align="right" />
  </div>
);

export default ProfileSummary;
