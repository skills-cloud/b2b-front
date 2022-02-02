import { useMemo } from 'react';
import { acc } from 'adapter/api/acc';

const useRoles = (organizationId?: string | number) => {
    const { data: whoAmIData } = acc.useGetAccWhoAmIQuery(undefined);

    const findRole = (role: string) => {
        return whoAmIData?.organizations_contractors_roles?.some((orgRole) => {
            return orgRole.organization_contractor_id === organizationId && orgRole.role === role;
        });
    };

    return useMemo(() => {
        if(organizationId) {
            const isAdmin = findRole('admin');
            const isPFM = findRole('pfm');
            const isPM = findRole('pm');
            const isRM = findRole('rm');

            return {
                su   : whoAmIData?.is_superuser,
                admin: isAdmin,
                pfm  : isPFM,
                pm   : isPM,
                rm   : isRM
            };
        }

        return {
            su   : whoAmIData?.is_superuser,
            admin: false,
            pfm  : false,
            pm   : false,
            rm   : false
        };
    }, [organizationId, JSON.stringify(whoAmIData)]);
};

export default useRoles;
