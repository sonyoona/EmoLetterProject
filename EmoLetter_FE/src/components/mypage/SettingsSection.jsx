/** 마이페이지의 설정 항목 하나. 제목·설명·구분선을 통일하기 위한 껍데기. */
const SettingsSection = ({ title, description, divider = true, children }) => (
  <section className={divider ? 'pt-6 border-t border-pink-100/70' : ''}>
    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
    {description && <p className="mt-1 mb-4 text-sm text-gray-500">{description}</p>}
    <div className={description ? '' : 'mt-4'}>{children}</div>
  </section>
);

export default SettingsSection;
