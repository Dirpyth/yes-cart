/*
 * Copyright 2009- 2016 Denys Pavlov, Igor Azarnyi
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
package org.yes.cart.service.endpoint.impl;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.yes.cart.domain.misc.MutablePair;
import org.yes.cart.domain.vo.*;
import org.yes.cart.service.endpoint.AttributeEndpointController;
import org.yes.cart.service.vo.VoAttributeService;

import java.util.List;

/**
 * User: denispavlov
 * Date: 09/08/2016
 * Time: 18:43
 */
@Component
public class AttributeEndpointControllerImpl implements AttributeEndpointController {

    private final VoAttributeService voAttributeService;

    @Autowired
    public AttributeEndpointControllerImpl(final VoAttributeService voAttributeService) {
        this.voAttributeService = voAttributeService;
    }

    @Override
    public @ResponseBody
    List<VoEtype> getAllEtypes() throws Exception {
        return voAttributeService.getAllEtypes();
    }

    @Override
    public @ResponseBody
    List<VoAttributeGroup> getAllGroups() throws Exception {
        return voAttributeService.getAllGroups();
    }

    @Override
    public @ResponseBody
    VoSearchResult<VoAttribute> getFilteredAttributes(@RequestBody final VoSearchContext filter) throws Exception {
        return voAttributeService.getFilteredAttributes(filter);
    }

    @Override
    public @ResponseBody
    List<MutablePair<Long, String>> getProductTypesByAttributeCode(@PathVariable("code") final String code) throws Exception {
        return voAttributeService.getProductTypesByAttributeCode(code);
    }

    @Override
    public @ResponseBody
    VoAttribute getAttributeById(@PathVariable("id") final long id) throws Exception {
        return voAttributeService.getAttributeById(id);
    }

    @Override
    public @ResponseBody
    VoAttribute createAttribute(@RequestBody final VoAttribute vo) throws Exception {
        return voAttributeService.createAttribute(vo);
    }

    @Override
    public @ResponseBody
    VoAttribute updateAttribute(@RequestBody final VoAttribute vo) throws Exception {
        return voAttributeService.updateAttribute(vo);
    }

    @Override
    public @ResponseBody
    void removeAttribute(@PathVariable("id") final long id) throws Exception {
        voAttributeService.removeAttribute(id);
    }
}
