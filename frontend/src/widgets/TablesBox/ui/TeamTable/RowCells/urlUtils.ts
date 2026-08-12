export const generateLeadsUrl = (idAmoCRM: number): string => {
  const crmUrl = import.meta.env.VITE_CRM_URL;
  if (!crmUrl) return '#';

  return `${crmUrl}/leads/pipeline/1019845/?filter%5Bpipe%5D%5B1019845%5D%5B%5D=23650510&filter%5Bmain_user%5D%5B%5D=${idAmoCRM}&useFilter=y`;
};

export const generateLeadsSourceLostUrl = (idAmoCRM: number): string => {
  const crmUrl = import.meta.env.VITE_CRM_URL;
  if (!crmUrl) return '#';

  return (
    `${crmUrl}/leads/pipeline/1019845/` +
    `?filter%5Bpipe%5D%5B1019845%5D%5B%5D=142` +
    `&filter%5Bpipe%5D%5B1019845%5D%5B%5D=143` +
    `&filter%5Bpipe%5D%5B1019845%5D%5B%5D=18661387` +
    `&filter%5Bpipe%5D%5B1019845%5D%5B%5D=18661390` +
    `&filter%5Bpipe%5D%5B1019845%5D%5B%5D=18661393` +
    `&filter%5Bpipe%5D%5B1019845%5D%5B%5D=18663592` +
    `&filter%5Bpipe%5D%5B1019845%5D%5B%5D=23017921` +
    `&filter%5Bpipe%5D%5B1019845%5D%5B%5D=23650510` +
    `&filter%5Bpipe%5D%5B1019845%5D%5B%5D=23662006` +
    `&filter%5Bpipe%5D%5B1019845%5D%5B%5D=23886259` +
    `&filter%5Bmain_user%5D%5B%5D=${idAmoCRM}` +
    `&filter%5Bcf%5D%5B578515%5D%5B%5D=empty` +
    `&filter%5Bdate_preset%5D=current_month` +
    `&useFilter=y`
  );
};

export const generateTasksUrl = (idAmoCRM: number): string => {
  const crmUrl = import.meta.env.VITE_CRM_URL;
  if (!crmUrl) return '#';

  return `${crmUrl}/todo/list/?filter%5Bmain_user%5D%5B%5D=${idAmoCRM}&filter%5Bstatus%5D%5B%5D=failed&sel=failed&useFilter=y&sel=10741582`;
};

export const generateConversationsUrl = (): string => {
  const chatwootUrl = import.meta.env.VITE_CHATWOOT_URL;
  if (!chatwootUrl) return '#';

  return `${chatwootUrl}/app/accounts/1/dashboard`;
};

export const generateTicketsUrl = (idInside: number): string => {
  const insideUrl = import.meta.env.VITE_INSIDE_URL;
  if (!insideUrl) return '#';

  return `${insideUrl}/tickets/incoming?isMailingExists=true&page=1&itemsPerPage=50&isAscending=false&sortBy=updated_at&teams=pre_sale&statuses=new&statuses=in_progress&statuses=waiting_for_support&assignees=${idInside}`;
};
