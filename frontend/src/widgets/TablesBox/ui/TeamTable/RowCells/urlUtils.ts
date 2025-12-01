export const generateLeadsUrl = (idAmoCRM: number): string => {
  const crmUrl = import.meta.env.VITE_CRM_URL;
  if (!crmUrl) return '#';

  return `${crmUrl}/leads/pipeline/1019845/?filter%5Bpipe%5D%5B1019845%5D%5B%5D=23650510&filter%5Bmain_user%5D%5B%5D=${idAmoCRM}&useFilter=y`;
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
