package org.yes.cart.remote.service.impl;

import org.yes.cart.domain.dto.CarrierSlaDTO;
import org.yes.cart.exception.UnableToCreateInstanceException;
import org.yes.cart.exception.UnmappedInterfaceException;
import org.yes.cart.remote.service.RemoteCarrierSlaService;
import org.yes.cart.service.dto.DtoCarrierSlaService;
import org.yes.cart.service.dto.GenericDTOService;

import java.util.List;

/**
 * User: Igor Azarny iazarny@yahoo.com
 * Date: 15-May-2011
 * Time: 17:22:15
 */
public class RemoteCarrierSlaServiceImpl
        extends AbstractRemoteService<CarrierSlaDTO>
        implements RemoteCarrierSlaService {

    /**
     * Construct remote service.
     *
     * @param carrierSlaDTOGenericDTOService carrier sla dto service to use
     */
    public RemoteCarrierSlaServiceImpl(final GenericDTOService<CarrierSlaDTO> carrierSlaDTOGenericDTOService) {
        super(carrierSlaDTOGenericDTOService);
    }


    /**
     * {@inheritDoc}
     */
    public List<CarrierSlaDTO> findByCarrier(final long carrierId) throws UnmappedInterfaceException, UnableToCreateInstanceException {
        return ((DtoCarrierSlaService) getGenericDTOService()).findByCarrier(carrierId);
    }


    /**
     * Fill dtos from entities
     * @param entities list of entities
     * @param dtos list of dtos
     * @throws UnmappedInterfaceException in case of config errors
     * @throws UnableToCreateInstanceException ion case of dto creating errors
     */
    /*public void fillDTOs(Collection<IFACE> entities, Collection<DTOIFACE> dtos)
            throws UnmappedInterfaceException, UnableToCreateInstanceException {
        for (IFACE entity : entities) {
            DTOIFACE dto = (DTOIFACE) dtoFactory.getByIface(getDtoIFace());
            assembler.assembleDto(dto, entity, valueConverterRepository, dtoFactory);
            dtos.add(dto);
        }
    } */
}
